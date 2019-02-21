import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorageModule, AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ChatProvider } from '../providers/chat/chat';
//email
import { EmailComposer } from '@ionic-native/email-composer';

import { Stripe } from '@ionic-native/stripe';
 
//import { MiniHeaderComponent } from '../components/mini-header/mini-header';

// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';
import { MapsProvider } from '../providers/maps/maps';

export const firebaseConfig = {
  apiKey: "AIzaSyCdNNcEvxnxbGQYEvbau7YCOLS5tw8Ia0s",
  authDomain: "lifechat-dev-3cf1e.firebaseapp.com",
  databaseURL: "https://lifechat-dev-3cf1e.firebaseio.com",
  projectId: "lifechat-dev-3cf1e",
  storageBucket: "",
  messagingSenderId: "874137376696"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false,
      inputBlurring: false,
      backButtonText: '',
      tabsHideOnSubPages: true,
      menuType: 'overlay',
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    Ionic2RatingModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AngularFirestore,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    UserProvider,
    ChatProvider,
    Geolocation,
    MapsProvider,
    AngularFireStorage,
    Stripe,
    Camera,
    EmailComposer
  ]
})
export class AppModule { }
