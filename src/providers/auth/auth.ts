import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../user/user';
import { Events } from 'ionic-angular';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import firebase from "firebase"
@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private userP: UserProvider,
    private events: Events,
    private afStorage: AngularFireStorage) {
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string, role: string, profile: any, file: any) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
          this.afStore.collection('users').doc(user.uid).set({ profile, role })
            .then(() => {
              let storageRef = firebase.storage().ref();
              if (file.certif) {
                const imageRef = storageRef.child(`${user.uid}/certif.jpg`);
                imageRef.putString(file.certif, firebase.storage.StringFormat.DATA_URL)
              }
              if (file.id) {
                const imageRef = storageRef.child(`${user.uid}/id.jpg`);
                imageRef.putString(file.id, firebase.storage.StringFormat.DATA_URL)
              }

              this.userP.getMyProfile().subscribe();
              resolve();
            })
        })
        .catch(e => {
          reject(e);
        })
    })
  }

  forgetpassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  isLogged() {
    this.userP.user = null;
    this.events.publish('logout');
    return this.afAuth.authState
  }

  uploadToStorage(data): AngularFireUploadTask {
    let newName = `${new Date().getTime()}`;
    return this.afStorage.ref(`files/${newName}`).putString(data);
  }

}
