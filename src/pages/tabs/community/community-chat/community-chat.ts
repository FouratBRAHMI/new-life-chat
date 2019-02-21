import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import firebase from "firebase/app";
import { ChatProvider } from '../../../../providers/chat/chat';
import { UserProvider } from '../../../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-community-chat',
  templateUrl: 'community-chat.html',
})
export class CommunityChatPage {
  @ViewChild(Content) content: Content;

  subject: any;
  chatText: string;
  textMaxLength: number = 400;
  me: any = {};
  communityData: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: ChatProvider,
    private userP: UserProvider) {

    this.me = firebase.auth().currentUser;
    this.subject = this.navParams.get('subject');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityChatPage');

    this.chatService.getCommunitySubjectById(this.subject.id).subscribe(data => {
      console.log(data);
      this.communityData = data;

      this.communityData.messages.forEach(element => {
        this.userP.getUserById(element.sender).first().subscribe(user => {
          element.ref = user;
          if (element.ref.profile.humeur) {
            element.ref.profile.humeur = element.ref.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          }
        });
      });
      setTimeout(()=>{
        this.content.scrollToBottom(300);
      },400)
    });
  }

  sendMessage(event: any) {
    if (!this.chatText)
      return;

    this.chatService.newSubjectMessage(this.subject.id, this.me.uid, this.chatText).subscribe(res => {
      this.chatText = '';
    });
  }

}
