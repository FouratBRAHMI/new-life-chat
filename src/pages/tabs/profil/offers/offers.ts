import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { UserProvider } from '../../../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {

  offer: any = 10;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private user: UserProvider,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
  }

  buyOffer() {

    let model = this.modalCtrl.create('CheckoutPage', {uid: this.navParams.get('uid'), amount: this.offer});
    model.present();
    model.onDidDismiss(()=>{
      this.viewCtrl.dismiss();
    })
    // this.user.buyOffer(this.navParams.get('uid'), this.offer).subscribe(res => {
    //   console.log('buyOffer()', res);
    //   this.navCtrl.pop();
    // });
  }

}
