import { Component } from '@angular/core';
import { IonicPage, AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ChatProvider } from '../../providers/chat/chat';


@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  profile: any;
  me: any = {};
  msgRecus: number = 0;
  rates;
  p;
  id;

  constructor(public navParams: NavParams,
    private user: UserProvider,
    public modalCtrl: ModalController, 
  private viewCtrl: ViewController) {
      this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    this.user.getProfileById(this.id)
      .subscribe(user => {
        console.log(user)
        this.profile = user['profile'];
        this.p = user;
        this.rates = user['rates'];
        if (this.profile.humeur) {
          this.profile.humeur = this.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }
        console.log(this.p);
        
      })
  }

  calculateRate(rates){
    let res = 0;
    rates.forEach(rate=> {
      res += rate.rate;
    })
    return (res / rates.length).toFixed(2);
  }
  
  close(){
    this.viewCtrl.dismiss();
  }

}
