import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../../providers/chat/chat';
import { UserProvider } from '../../../providers/user/user';
import firebase from "firebase/app";

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  subjects = ['famille', 'sexualite', 'travail', 'couple', 'addictions', 'argent', 'divers'];
  selectedSubject: string = "famille";
  subjectsMessages: any = [];
  me: any = {};

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private chatService: ChatProvider,
    private userService: UserProvider) {

    this.me = firebase.auth().currentUser;
    
    this.selectedSubject = 'famille';

    this.loadSubjets(this.selectedSubject);
  }

  loadSubjets(subject) {
    let getdata = this.chatService.getCommunitySubjects(subject).subscribe(data => {
      this.subjectsMessages = data;
      console.log(this.subjectsMessages, subject);
      this.subjectsMessages.forEach(item => {
        let getuser = this.userService.getUserById(item.data.user).subscribe(user => {
          item.data.profile = user;
          //getuser.unsubscribe();
        });
      });
    });
  }

  selectThisSubject(sub) {
    this.selectedSubject = sub;
    this.loadSubjets(this.selectedSubject);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  }

  newSebject() {

    let modal = this.modalCtrl.create('CreateChatPage', {subject: this.selectedSubject}).present();

    // this.alertCtrl.create({
    //   title: 'Lancer un nouveau sujet',
    //   inputs: [
    //     {
    //       name: 'name',
    //       placeholder: 'Nom du sujet'
    //     },
    //     {
    //       name: 'text',
    //       placeholder: 'Sujet ...'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Envoyer',
    //       handler: data => {
    //         if (data.name != '' && data.text != '')  {
    //           this.startNewSubject(data);
    //         }
    //       }
    //     },
    //     {
    //       text: 'Annuler',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // }).present();
  }

  startNewSubject(data) {
    this.chatService.startNewSubject(data.name, data.text, this.selectedSubject).then(res => {
      console.log(res);
    });
  }

  openChat(item) {
    if (this.isMember(item)) {
      this.navCtrl.push('CommunityChatPage', { subject: item });
    }
  }

  isMember(item) {
    if (!item.data.members) 
      item.data.members = [];

    return item.data.members.includes(this.me.uid);
  }
  
  joinConversation(id) {
    console.log(this.me.uid, id);
    
    this.chatService.joinCommunityConversation(this.me.uid, id).subscribe(res => {
      console.log('joinConversation(id)', res);
    });
  }

  leaveConversation(id) {
    this.chatService.leaveCommunityConversation(this.me.uid, id).subscribe(res => {
      console.log('leaveConversation(id)', res);
    });
  } 

  deleteConversation(id) {
    this.chatService.deleteCommunityConversation(id).then(res => {
      console.log('deleteConversation(id)', res);
    });
  } 

}
