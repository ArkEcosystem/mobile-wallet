import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';

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
    public marketDataProvider: MarketDataProvider,
    public settingsDataProvider: SettingsDataProvider,
    public arkApiProvider: ArkApiProvider,
  ) {
    platform.ready().then(() => {
      this.authProvider.isLoginSubject$.subscribe((status) => {
        if (!status) this.rootPage = 'ProfileSigninPage';
      });

      translateService.setDefaultLang('en');
      // TODO: Get language from settings provider
      translateService.use('en');
      statusBar.styleDefault();

      this.authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
        splashScreen.hide();

        if (hasSeenIntro) {
          this.rootPage = 'LoginPage';
          return;
        }

        this.rootPage = 'IntroPage';
      });

    });
  }

}

