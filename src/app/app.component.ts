import { Component, ViewChild } from '@angular/core';
import { Platform, Config, Nav, MenuController } from 'ionic-angular';
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
  public rootPage = null;
  public profile = null;
  public network = null;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authProvider: AuthProvider,
    private translateService: TranslateService,
    private localDataProvider: UserDataProvider,
    private marketDataProvider: MarketDataProvider,
    private settingsDataProvider: SettingsDataProvider,
    private arkApiProvider: ArkApiProvider,
    private menuCtrl: MenuController,
    private config: Config,
  ) {
    platform.ready().then(() => {
      this.authProvider.isLoginSubject$.subscribe((status) => {
        if (!status) {
          this.menuCtrl.enable(false, 'sidebarMenu');
          this.openPage('ProfileSigninPage');
        } else {
          this.profile = this.localDataProvider.profileActive;
          this.network = this.localDataProvider.networkActive;
          this.menuCtrl.enable(true, 'sidebarMenu');
        }
      });

      statusBar.styleDefault();

      this.authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
        splashScreen.hide();

        if (hasSeenIntro) {
          this.openPage('LoginPage');
          return;
        }

        this.openPage('IntroPage');
      });

    });

    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translateService.setDefaultLang('en');
    this.translateService.use('en'); // Set your language here

    this.translateService.get('BACK_BUTTON_TEXT').subscribe(translate => {
      this.config.set('ios', 'backButtonText', translate);
    });
  }

  openPage(p) {
    this.nav.setRoot(p);
  }

  logout() {
    this.authProvider.logout();
  }

}

