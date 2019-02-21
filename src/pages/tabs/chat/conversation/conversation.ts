import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController, Content, ModalController } from 'ionic-angular';
import { ChatProvider } from '../../../../providers/chat/chat';
import { UserProvider } from '../../../../providers/user/user';
import firebase from "firebase/app";

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  @ViewChild(Content) content: Content;

  subject: string;
  id: string;
  newMessage: string;
  textMaxLength: number = 400;
  conv: any;
  client: any = {};
  observ: any;
  me: any = {};

  constructor(private navParams: NavParams, private viewCtrl: ViewController, 
    private chat: ChatProvider, private alertCtrl: AlertController, 
    private userP: UserProvider,
  private modalCtrl: ModalController) {
    this.subject = this.navParams.get('subject');
    this.id = this.navParams.get('id');

    this.me = firebase.auth().currentUser;
  }

  ionViewDidEnter() {
    if (this.id) {
      this.observ = this.chat.getConversation(this.id)
        .subscribe(conv => {
          this.conv = conv;
          console.log(conv);
          let proff = this.conv.client;
          if (this.userP.user.role == 'client') {
            proff = this.conv.pro;
          }
          this.userP.getUserById(proff).subscribe(user => {
            this.client = user;
            if (this.client.profile.humeur) 
            this.client.profile.humeur = this.client.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            console.log(this.client);
          });

          setTimeout(()=>{
            this.content.scrollToBottom(300);
          },400)
          
          
        });
    }
  }

  openProfile(id){
    console.log(id);
    this.modalCtrl.create('UserProfilePage', { id }).present();
  }

  ionViewDidLeave(){
    if (this.observ)
      this.observ.unsubscribe();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  send() {
    if (this.userP.user.role == 'pro') {
      this.doSend();
    }
    else {
      if (this.userP.user.profile.msgCount > 0) {
        this.doSend();
      }
      else {
        this.alertCtrl.create({
          title: 'Oups!',
          subTitle: 'Pour bénéficier de nos services merci d\'acheter une de nos offres.',
          message: 'Vérifiez votre profil (en cliquant sur le bouton Card) et consultez nos offres.'
        }).present();
      }
    } 
    
  }

  doSend() {
    if (!this.id) {
      this.chat.startConversation(this.newMessage, this.subject).then(r => {
        this.decrement();
        console.log(r);
        this.newMessage = '';
        this.viewCtrl.dismiss().then(() => {
          this.alertCtrl.create({
            title: 'Nouvelle Conversation',
            subTitle: 'Votre message a bien été envoyé!',
            message: "Vous serez averti lors du traitement de votre message par l\'un de nos conseillers"
          }).present();
        })
      })
    } else {
      this.chat.sendMsg(this.id, this.newMessage).subscribe(r => {
        this.newMessage = '';
        this.decrement();
      })
    }
  }

  decrement() {
    this.userP.decrementMsgCount(this.me.uid).subscribe(res => {
      console.log('decrementMsgCount', res);
    });
  }

}
