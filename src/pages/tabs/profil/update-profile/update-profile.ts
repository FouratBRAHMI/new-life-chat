import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../../providers/user/user';

/**
 * Generated class for the UpdateProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {

  me: any;
  subjects = ['famille', 'sexualite', 'pro', 'couple', 'addictions', 'financier', 'divers'];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private user: UserProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateProfilePage');

    this.user.getMyProfile()
      .subscribe(user => {
        this.me = user;
        console.log(this.me);
      })
  }

  doUpdate() {
    this.user.updateProfile(this.navParams.get('uid'), this.me.profile).subscribe(res => {
      console.log(res);
      this.navCtrl.pop();
    });
  }

  isSubjectSelected(sub) {
    if (this.me.profile.themes)
      return this.me.profile.themes.includes(sub);
    
    return false;
  }

  selectThisSubject(sub) {
    if (!this.me.profile.themes.includes(sub)) {
      this.me.profile.themes.push(sub)
    } else if (this.me.profile.themes.includes(sub)) {
      let index = this.me.profile.themes.indexOf(sub, 0);
      if (index > -1) {
        this.me.profile.themes.splice(index, 1);
      }
    }
  }

}
