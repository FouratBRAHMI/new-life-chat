import { Component } from '@angular/core';
import { IonicPage, ModalController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../../providers/chat/chat';
import { UserProvider } from '../../../providers/user/user';
//email
import { EmailComposer } from '@ionic-native/email-composer';
import { AuthProvider } from '../../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  subjects = ['famille', 'sexualite', 'travail', 'couple', 'addictions', 'argent', 'divers'];
  conversations = [];
  online = false;
  obs: any;
  observable: any;



  //email
  subject='Name';
  body='Message';
  to='signaler@lifechat.fr';
  authUser="";

  constructor(private modalCtrl: ModalController,
    private chat: ChatProvider,
    private userP: UserProvider,
    private alertCtrl: AlertController,
    private emailComposer:EmailComposer,
    private afAuth: AngularFireAuth, private auth: AuthProvider
    ) {
        
      this.authUser = this.afAuth.auth.currentUser.uid;
    }
  
//email
send(conv){ 
  console.log(conv);

let message = "";
  if (this.authUser == conv.data.client)
     message = 'Le user : '+conv.data.client+' signale le professionnel : '+conv.data.pro;
  else if (this.authUser == conv.data.pro)
      message = 'Le professionnel : '+conv.data.pro+' signale le user : '+conv.data.client;
  else
      message = "error";
  let email ={ 
    to: this.to,
    cc:[],
    subjects:this.subjects,
    body: message+"\nLe message est : "+this.body,
    isHtml:false,
    app:"Gmail"
  }
  console.log(message+"\n"+this.body)
  this.emailComposer.open(email);
}
  

  ionViewDidEnter() {
    this.observable = this.chat.getMyMessages().subscribe(resp => {
      this.conversations = resp.filter(c => c.data['pro'] && c.data['messages']);
      this.conversations.forEach(element => {
        let ref = element.data.pro;
        if (this.userP.user.role == 'pro') {
          this.userP.getUserById(element.data.client).first().subscribe(user => {
            element.ref = user;
            if (element.ref.profile.humeur) {
              element.ref.profile.humeur = element.ref.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            }
          });
        } else {
          this.userP.getUserById(element.data.pro).first().subscribe(user => {
            element.ref = user;
          });
        }
        console.log('ref', this.userP.user.role, ref);

        // this.userP.getUserById(ref).first().subscribe(user => {
        //   element.ref = user;
        //   if (this.userP.user.role == 'pro') {
        //     if (element.ref.profile.humeur) {
        //       element.ref.profile.humeur = element.ref.profile.humeur.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        //     }
        //   }
        // });
      });
      console.log(this.conversations)
    })
  }

  
  deleteConv(id) {
    console.log(id)
    this.alertCtrl.create({
      subTitle: 'Voulez vous supprimer cette conversation ? ',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.chat.deleteConversation(id).subscribe();
          }
        }
      ]
    }).present();
  }

  Convs(open) {
    return this.conversations.filter(item => {
      if (!item.archived) {
        if (open)
          return !item.data.closed;
        else
          return item.data.closed;
      }

    })
  }

  closeConv(conv) {
    let modal = this.modalCtrl.create('ChangeAdvisorPage');

    modal.onDidDismiss(rate => {
      console.log('modal closeConv rate, salved', rate);
      if (rate != -1) {
        this.chat.ratePro(conv.data.pro, rate).subscribe(res => {
          console.log("ratePro res", res);
        });
        this.chat.closeConversation(conv.id).subscribe();
      }

    });

    modal.present();
  }

  ChangePro(id) {
    let modal = this.modalCtrl.create('CloseChatPage');

    modal.onDidDismiss(data => {
      console.log('modal ChangePro rate', data);
      if (data != -1) {
        this.chat.changePro(id).subscribe();
        this.alertCtrl.create({
          title: 'Nouvelle Conversation',
          subTitle: 'Votre message a bien été envoyé!',
          message: "Vous serez avertis lors du traitement de votre message par l\'un de nos conseillers"
        }).present();
      }
    });
    modal.present();

  }

  showProfile(id) {
    this.modalCtrl.create('UserProfilePage', { id }).present();
  }

  isAvailable() {
    console.log(this.online)
    if (this.online) {
      this.obs = this.chat.getInvitations().subscribe(conv => {
        console.log('getInvitations()', conv);
        console.log('getInvitations() user ', this.userP.user);
        let convss = conv;
        convss = convss.filter(item => this.userP.user.profile.themes.includes(item.data.subject));
        console.log('getInvitations()', convss);
        convss.forEach(el => {
          this.alertCtrl.create({
            title: 'Nouvelle conversation',
            subTitle: '',
            message: el.data.messages[0].content,
            buttons: [
              {
                text: 'Décliner',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Répondre',
                handler: () => {
                  console.log('Buy clicked');
                  this.chat.acceptInvitation(el.id).subscribe(r => {
                    this.modalCtrl.create('ConversationPage', { subject: null, id: el.id }).present();
                  })
                }
              }
            ]
          }).present();
        })
      })
    } else {
      this.obs.unsubscribe();
    }
  }

  ionViewDidLeave() {
    if (this.obs)
      this.obs.unsubscribe();
    this.observable.unsubscribe();
  }

  openChat(subject, id) {
    this.modalCtrl.create('ConversationPage', { subject, id }).present();
  }




  //Reclamation
  Reclamation(conv) {
    let alert = this.alertCtrl.create({
      title: 'Voulez vous signaler cette conversation ?',
      inputs: [
        {
          name: 'message',
          placeholder: 'Vous pouvez ajouter un message !',
          type: 'text'
        },
        
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmer',
          handler: data => {
          //  console.log('data user',this.userP.user.profile.email);


          /*  console.log('body',this.body);
            console.log('subject',this.subject);
            console.log('data.message',data.message);
            console.log('data.Name',data.Name); */
            this.body = data.message
            this.subject=this.userP.user.profile.email

            console.log('body',this.body);
            console.log('subject',this.subject);
           // console.log('data.message',data.message);
           // console.log('data.Name',data.Name);
              console.log('Click confirmé');
              
            this.send(conv);
            console.log('Click confirmé');
              // logged in!
           
          }
        }
      ]
    });
    alert.present();
  }





  }
  



