import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatProvider } from '../../../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-create-chat',
  templateUrl: 'create-chat.html',
})
export class CreateChatPage {
  data = {
    name: '',
    text: ''
  }

  constructor(public navParams: NavParams, private viewCtrl: ViewController, private chatService: ChatProvider) {
    console.log(this.navParams.get('subject'))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateChatPage');
  }

  cancel() {
    this.viewCtrl.dismiss()
  }

  send() {
    if (this.data.name != '' && this.data.text != '') {
      this.chatService.startNewSubject(this.data.name, this.data.text, this.navParams.get('subject')).then(res => {
        this.viewCtrl.dismiss();
      });
    }
  }

}
