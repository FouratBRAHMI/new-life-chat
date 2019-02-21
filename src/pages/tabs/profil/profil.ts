import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { UserProvider } from '../../../providers/user/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import firebase from "firebase/app";
import { ChatProvider } from '../../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {
  profile: any;
  me: any = {};
  msgRecus: number = 0;
  rates;

  constructor(public navCtrl: NavController,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private user: UserProvider,
    private iab: InAppBrowser,
    public chatProvider: ChatProvider,
    public modalCtrl: ModalController) {

    this.me = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    this.user.getMyProfile()
      .subscribe(user => {
        this.profile = user.profile;
        this.rates = user['rates'];
        if (this.profile.humeur) {
          this.profile.humeur = this.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }
        console.log(user, this.user.user);
        if (this.user.user.role == 'pro') {
          this.chatProvider.getConvByPro(this.me.uid).subscribe(res => {
            console.log('getConvByPro', res);
            this.msgRecus = 0;
            res.forEach(element => {
              if (element.data.messages)
                element.data.messages.forEach(msg => {
                  if (msg.sender == 'client') {
                    this.msgRecus++;
                  }
                });
            });
          });
        }

      })
  }

  calculateRate(rates) {
    let res = 0;
    rates.forEach(rate => {
      res += rate.rate;
    })
    return (res / rates.length).toFixed(2);
  }

  openCGU() {
    this.iab.create('https://firebasestorage.googleapis.com/v0/b/lifechat-dev.appspot.com/o/CGU_LIFECHAT.pdf?alt=media', '_system')
  }

  contactUs() {
    this.alertCtrl.create({
      title: 'Nous contacter',
      subTitle: 'Pour toutes questions, n’hésitez pas à nous contacter à l’adresse mail suivante:',
      message: 'Support-lifechat@lifechat.com'
    }).present();
  }

  doLogout() {
    this.alertCtrl.create({
      title: 'ُEtes vous sûr de vouloir vous déconnecter?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.auth.logout().then(res => {
              this.navCtrl.parent.parent.setRoot('LoginPage');
            })
          }
        },
        {
          text: 'Non',
          handler: () => {
          }
        }
      ]
    }).present();
  }


  gotoOffers() {
    this.navCtrl.push("OffersPage", { uid: this.me.uid });
  }

  updateProfile() {
    this.navCtrl.push("UpdateProfilePage", { uid: this.me.uid });
  }

  changeHumeur() {
    this.navCtrl.push("ChangeHumeurPage", { uid: this.me.uid });
  }

}
