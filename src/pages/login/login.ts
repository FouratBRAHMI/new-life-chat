import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {
    email: '',
    password: ''
  }

  constructor(private navCtrl: NavController,
    private auth: AuthProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private userP: UserProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  doLogin(form) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.auth.login(form.value.email, form.value.password).then(res => {
      console.log(res);
      this.userP.getMyProfile().subscribe(u => {
        this.navCtrl.setRoot("TabsPage")
          .then(() => loader.dismiss());
      });

    })
      .catch(e => {
        this.toastCtrl.create({
          duration: 3000,
          message: e.message
        }).present();
        loader.dismiss()
      });
  }

  forgetPass() {
    let alert = this.alertCtrl.create({
      title: 'Réinitialiser votre mot de passe',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Réinitialiser',
          handler: data => {
            this.auth.forgetpassword(data.email).then(r => console.log(r), e => {
              this.toastCtrl.create({
                duration: 3000,
                message: e.message
              }).present();
            });
          }
        }
      ]
    });
    alert.present();
  }

}
