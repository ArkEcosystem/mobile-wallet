import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';

import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = null;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider,
    public translateService: TranslateService,
    public localDataProvider: UserDataProvider,
    public marketlDataProvider: MarketDataProvider,
  ) {
    platform.ready().then(() => {
      this.authProvider.logoutObserver.subscribe((status) => {
        this.rootPage = 'ProfileSigninPage';
      });

      translateService.setDefaultLang('en');
      // TODO: Get language from settings provider
      translateService.use('en');

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.authProvider.introHasSeen().subscribe((hasSeenIntro) => {
        splashScreen.hide();

        if (hasSeenIntro) {
          authProvider.masterPasswordHasSet().subscribe((hasSetMasterPassword) => {
            const activeProfile = authProvider.activeProfileGet();

            if (!hasSetMasterPassword && activeProfile) {
              this.rootPage = 'ProfileSigninPage';
            } else {
              this.rootPage = 'LoginPage';
            }

            return;
          });
        }

        this.rootPage = 'IntroPage';
      });

    });
  }

}

