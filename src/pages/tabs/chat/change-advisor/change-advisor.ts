import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ChangeAdvisorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-advisor',
  templateUrl: 'change-advisor.html',
})
export class ChangeAdvisorPage {

  rate: number = 2;
  solved: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CloseChatPage');
  }

  onModelChange(e) {
    console.log(e, this.rate);
  }

}
