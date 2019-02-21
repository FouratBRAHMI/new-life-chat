import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  card = {
    number: '',
    expMonth: null,
    expYear: null,
    cvc: ''
  };

  constructor(public navParams: NavParams, private stripe: Stripe, private viewCtrl: ViewController, private userP: UserProvider) {
    console.log(this.navParams.get('uid'));
    console.log(this.navParams.get('amount'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  pay() {
    let card = {
      number: this.card.number,
      expMonth: parseInt(this.card.expMonth),
      expYear: parseInt(this.card.expYear),
      cvc: this.card.cvc
    }
    console.log(card)
    this.stripe.createCardToken(card)
      .then(token => {
        console.log(token);
        this.userP.pay(this.navParams.get('uid'), token, this.navParams.get('amount')).then(resp => {
          this.viewCtrl.dismiss();
        })

      })
      .catch(e => {
        alert(e)
      })
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
