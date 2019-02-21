import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { AngularFirestore } from 'angularfire2/firestore';
import { Stripe } from '@ionic-native/stripe';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';

  constructor(platform: Platform, stripe: Stripe, statusBar: StatusBar, splashScreen: SplashScreen, auth: AuthProvider, user: UserProvider, afStore: AngularFirestore) {
    /* afStore.firestore.settings({ timestampsInSnapshots: true }); */
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      stripe.setPublishableKey('pk_test_39dkYe20maXXdwicB6RQk2Nj');

      statusBar.styleDefault();
      auth.isLogged().subscribe(u => {
        if (u) {
          user.getMyProfile().subscribe(u => {
            this.rootPage = 'TabsPage';
            splashScreen.hide();
          });

        }
        splashScreen.hide();
      });
    });
  }
}

