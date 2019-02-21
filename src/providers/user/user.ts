import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase/app';
import 'firebase/storage';


@Injectable()
export class UserProvider {
  user: any;

  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
  }

  getMyProfile() {
    return this.afAuth.authState
      .flatMap(u => {
        return this.afStore.collection('users').doc(u.uid).valueChanges()
          .map(res => {
            this.user = res;
            return <{ role: string, profile: any }>res;
          });
      })
  }

  getUserById(uid) {
    return this.afStore.collection('users').doc(uid).valueChanges()
      .map(res => {
        return res;
      });
  }

  getProfileById(id) {
    return this.afStore.collection('users').doc(id).valueChanges().first();
  }

  // uploadPhoto(base64, uid) {
  //   return firebase.storage().ref().child('profil_' + uid + '.jpg').putString(base64, 'base64');
  // }

  // updatePhoto(uid, photoURL) {
  //   return this.afStore.collection('users').doc(uid).valueChanges().first()
  //     .flatMap(c => {
  //       c['profile'].photoURL = photoURL;
  //       return this.afStore.collection('users').doc(uid).set(c);
  //     })
  // }

  buyOffer(uid, msgCount) {
    return this.afStore.collection('users').doc(uid).valueChanges().first()
      .flatMap(c => {
        c['profile'].msgCount = parseInt(c['profile'].msgCount) + parseInt(msgCount);
        return this.afStore.collection('users').doc(uid).set(c);
      });
  }

  pay(uid, token, amount) {
    // return this.afStore.collection('users').doc(uid).valueChanges().first()
    //   .flatMap(c => {
    //     if (!c['profile'].checkouts)
    //       c['profile'].checkouts = [];
    //     c['profile'].checkouts.push({ token, amount })
    //     return this.afStore.collection('users').doc(uid).set(c);
    //   });

    // return this.afStore.collection('users').doc(uid).collection('checkouts').add({ token, amount });
    return this.afStore.collection('checkouts').add({ token, amount, uid });
  }

  decrementMsgCount(uid) {
    return this.afStore.collection('users').doc(uid).valueChanges().first()
      .flatMap(c => {
        if (c['profile'].msgCount > 0) {
          c['profile'].msgCount = c['profile'].msgCount - 1;
        }
        return this.afStore.collection('users').doc(uid).set(c);
      });
  }

  updateProfile(uid, profile) {
    return this.afStore.collection('users').doc(uid).valueChanges().first()
      .flatMap(c => {
        c['profile'] = profile;
        return this.afStore.collection('users').doc(uid).set(c);
      });
  }

  updateHumeur(uid, humeur) {
    return this.afStore.collection('users').doc(uid).valueChanges().first()
      .flatMap(c => {
        c['profile'].humeur = humeur;
        return this.afStore.collection('users').doc(uid).set(c);
      });
  }

}
