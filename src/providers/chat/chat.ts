import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../user/user';
import 'rxjs/add/operator/first';

@Injectable()
export class ChatProvider {

  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore, private userP: UserProvider) {
  }

  startConversation(message: string, subject: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(u => {
        this.afStore.collection('conversations').add({ client: u.uid, pro: null, subject, 'client-seen': 1, 'pro-seen': 0, messages: [{ sender: 'client', date: new Date(), content: message }] })
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            reject(e);
          })
      })
    })
  }

  getConversation(id) {
    return this.afStore.collection('conversations').doc(id).valueChanges().map(c => {
      c[this.userP.user.role + '-seen'] = c['messages'].length;
      this.afStore.collection('conversations').doc(id).set(c);
      return c;
    });
  }

  closeConversation(id) {
    return this.afStore.collection('conversations').doc(id).valueChanges().first()
      .flatMap(c => {
        c['closed'] = true;
        return this.afStore.collection('conversations').doc(id).set(c);
      })
  }

  ratePro(idPro, rate) {
    return this.afStore.collection('users').doc(idPro).valueChanges().first()
      .flatMap(c => {
        if (c['rates'])
          c['rates'].push(rate);
        else
          c['rates'] = [rate];
        return this.afStore.collection('users').doc(idPro).set(c);
      })
  }

  deleteConversation(id) {
    return this.afStore.collection('conversations').doc(id).valueChanges().first()
      .flatMap(c => {
        c['archived'] = true;
        return this.afStore.collection('conversations').doc(id).set(c);
      })
  }

  changePro(id) {
    return this.afStore.collection('conversations').doc(id).valueChanges().first()
      .flatMap(c => {
        c['archived'] = true;
        this.startConversation(c['messages'], c['subject']);
        this.userP.decrementMsgCount(c['client']).first().subscribe();
        return this.afStore.collection('conversations').doc(id).set(c);
      })
  }

  sendMsg(convId, message) {
    return this.afStore.collection('conversations').doc(convId).valueChanges().first()
      .flatMap(c => {
        c['messages'].push({
          content: message,
          date: new Date(),
          sender: this.userP.user.role
        })
        return this.afStore.collection('conversations').doc(convId).set(c);
      })
  }

  getMyMessages() {
    return this.afAuth.authState.flatMap(u => {
      return this.afStore.collection('conversations', ref => ref.where(this.userP.user.role, '==', u.uid)).snapshotChanges()
        .map(col => {
          return col.map(c => {
            return { id: c.payload.doc.id, data: c.payload.doc.data() };
          })
        })
    })
  }

  startNewSubject(name: string, message: string, subject: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(user => {
        this.afStore.collection('community').add({
          user: user.uid,
          subject: subject,
          name: name,
          messages: [{ sender: user.uid, date: new Date(), content: message }],
          members: [user.uid]
        })
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            reject(e);
          })
      })
    })
  }

  getCommunitySubjects(subject) {
    return this.afStore.collection('community', ref => ref.where('subject', '==', subject)).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          return { id: a.payload.doc.id, data: a.payload.doc.data() };
        });
      });
  }

  getCommunitySubjectById(id) {
    return this.afStore.collection('community').doc(id).valueChanges();
  }

  joinCommunityConversation(uid, id) {
    return this.afStore.collection('community').doc(id).valueChanges().first()
      .flatMap(element => {
        element['members'].push(uid);
        return this.afStore.collection('community').doc(id).update(element);
      });
  }

  leaveCommunityConversation(uid, id) {
    return this.afStore.collection('community').doc(id).valueChanges().first()
      .flatMap(element => {
        let index = element['members'].indexOf(uid, 0);
        if (index > -1) {
          element['members'].splice(index, 1);
        }
        return this.afStore.collection('community').doc(id).set(element);
      });
  }

  deleteCommunityConversation(id) {
    return this.afStore.collection('community').doc(id).delete();
  }

  newSubjectMessage(id, uid, message) {
    return this.afStore.collection('community').doc(id).valueChanges().first()
      .flatMap(element => {
        element['messages'].push({
          content: message,
          date: new Date(),
          sender: uid
        });
        return this.afStore.collection('community').doc(id).set(element);
      });
  }

  getInvitations() {
    return this.afStore.collection('conversations', ref => ref.where('pro', '==', null)).snapshotChanges()
      .map(col => {
        return col.map(c => {
          return { id: c.payload.doc.id, data: c.payload.doc.data() };
        })
      })
  }

  getConvByPro(proId) {
    return this.afStore.collection('conversations', ref => ref.where('pro', '==', proId)).snapshotChanges()
      .map(col => {
        return col.map(c => {
          return { id: c.payload.doc.id, data: c.payload.doc.data() };
        })
      })
  }

  acceptInvitation(convId) {
    return this.afStore.collection('conversations').doc(convId).valueChanges().first()
      .flatMap(c => {
        return this.afAuth.authState.flatMap(u => {
          c['pro'] = u.uid;
          return this.afStore.collection('conversations').doc(convId).update(c);
        })
      })
  }

}
