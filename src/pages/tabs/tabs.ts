import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  profilRoot = 'ProfilPage'
  chatRoot = 'ChatPage'
  communityRoot = 'CommunityPage'
  carteRoot = 'CartePage'


  constructor(public navCtrl: NavController) {}

}
