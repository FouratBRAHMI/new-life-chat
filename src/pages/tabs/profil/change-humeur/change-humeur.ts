import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../../providers/user/user';

/**
 * Generated class for the ChangeHumeurPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-humeur',
  templateUrl: 'change-humeur.html',
})
export class ChangeHumeurPage {

  me: any;
  humeurs = [
    { name: 'Enervé', img: 'Enerve' },
    { name: 'Seul', img: 'Seul' },
    { name: 'Heureux', img: 'Heureux' },
    { name: 'Détendu', img: 'Detendu' },
    { name: 'Confiant', img: 'Confiant' },
    { name: 'Amoureux', img: 'Amoureux' },
    { name: 'Fatigué', img: 'Fatigue' },
    { name: 'Triste', img: 'Triste' },
    { name: 'Apeuré', img: 'Apeure' }
  ];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private user: UserProvider) {

    this.user.getMyProfile() 
      .subscribe(user => {
        this.me = user;
        console.log(this.me);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeHumeurPage');
  }

  doUpdate() {
    this.user.updateHumeur(this.navParams.get('uid'), this.me.profile.humeur).subscribe(res => {
      console.log(res);
      this.navCtrl.pop();
    });
  }
}
