import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '@providers/auth/auth';
import { LocalDataProvider } from '@providers/local-data/local-data';

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
    public localDataProvider: LocalDataProvider,
  ) {
    platform.ready().then(() => {
      translateService.setDefaultLang('en');
      // TODO: Get language from settings provider
      translateService.use('en');

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.authProvider.introHasSeen().subscribe((hasSeenIntro) => {
        splashScreen.hide();

        if (hasSeenIntro) {
          const hasSetMasterPassword = authProvider.masterPasswordHasSet();
          const activeProfile = authProvider.activeProfileGet();

          if (!hasSetMasterPassword && activeProfile) {
            this.rootPage = 'ProfileDashboardPage';
          } else {
            this.rootPage = 'WalletEmptyPage';
          }
          
          return;
        }

        this.rootPage = 'IntroPage';
      });

    });
  }
}

