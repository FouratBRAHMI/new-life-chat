/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const logging = require('@google-cloud/logging')();
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'EUR';

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.firestore.document('checkouts/{userId}')
    .onCreate((snap, context) => {
      try{
        const val = snap.data();
        var msgCount = val.amount;

        return admin.firestore().collection('users').doc(val.uid).get()
            //.once('value').then((snapshot) => {
            .then(snapshot => {
                return snapshot.data();
            }).then((customer) => {
          
              // Create a charge using the pushId as the idempotency key
              // protecting against double charges

              //add the price
              var price = 100;
              msgCount = parseInt(msgCount, 10) + parseInt(customer.profile.msgCount, 10);

              if (val.amount === 10)
              price = price * 7,99
              else if (val.amount === 20)
              price = price * 14,99
              else if (val.amount === 50)
              price = price * 22,99

              const amount = price;
              const idempotencyKey = context.params.userId;
              const source = val.token.id;
              const charge = {amount, currency, source};
              //if (val.token.id !== null) {
              //  charge.source = val.token.id;
              //}
              return stripe.charges.create(charge, {idempotency_key: idempotencyKey});
            }).then((response) => {
              // If the result is successful, write it back to the database
              //return snap.doc.update(response);
              //console.log(msgCount);
              //admin.firestore().collection("checkouts").set(response);
                return admin.firestore().collection('users').doc(val.uid).update("profile.msgCount", msgCount);
            });  
          } catch(error) {
              console.log(error);
              snap.ref.set({error: userFacingMessage(error)}, { merge: true });
              return reportError(error, {user: context.params.userId});
          }
        });
// [END chargecustomer]]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate((user) => {
  return stripe.customers.create({
    email: user.email,
  }).then((customer) => {
    return admin.firestore().collection('users').doc(`${user.uid}`).update({ "customer_id" : customer.id});
  });
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete((user) => {
  return admin.firestore().document(`/users/${user.uid}`).once('value').then(
      (snapshot) => {
        return snapshot.val();
      }).then((customer) => {
        return stripe.customers.del(customer.customer_id);
      }).then(() => {
        return admin.firestore().document(`/users/${user.uid}`).remove();
      });
    });

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: {function_name: process.env.FUNCTION_NAME},
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
       return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}