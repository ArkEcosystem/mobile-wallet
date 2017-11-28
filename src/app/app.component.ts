import { Component, ViewChild } from '@angular/core';
import { Platform, Config, Nav, MenuController, AlertController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Wallet, Profile } from '@models/model';
import * as arkts from 'ark-ts';

@Component({
  templateUrl: 'app.html',
  providers: [ScreenOrientation],
})
export class MyApp {
  public rootPage = 'LoginPage';
  public profile = null;
  public network = null;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private alert = null;
  private exitText = null;
  private logoutText = null;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authProvider: AuthProvider,
    private translateService: TranslateService,
    private userDataProvider: UserDataProvider,
    private marketDataProvider: MarketDataProvider,
    private arkApiProvider: ArkApiProvider,
    private settingsDataProvider: SettingsDataProvider,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private config: Config,
    private keyboard: Keyboard,
    private screenOrientation: ScreenOrientation,
    private app: App,
  ) {
    platform.ready().then(() => {
      splashScreen.hide();
      menuCtrl.enable(false, 'sidebarMenu');
      statusBar.styleDefault();

      platform.registerBackButtonAction(() => {
        if (this.menuCtrl && this.menuCtrl.isOpen()) {
          return this.menuCtrl.close();
        }
        let navPromise = app.navPop();
        if (!navPromise) {
          if (this.nav.getActive().name === 'LoginPage' || this.nav.getActive().name === 'IntroPage') {
            this.showConfirmation(this.exitText, () => {
              platform.exitApp();
            });
          } else {
            this.showConfirmation(this.logoutText, () => {
              this.logout();
            });
          }
        }
      }, 500);

      if (platform.is('cordova')) {
        keyboard.disableScroll(false);
        keyboard.hideKeyboardAccessoryBar(true);

        keyboard.onKeyboardShow().subscribe(() => document.body.classList.add('keyboard-is-open'));
        keyboard.onKeyboardHide().subscribe(() => document.body.classList.remove('keyboard-is-open'));

        screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }

      authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
        if (!hasSeenIntro) {
          this.openPage('IntroPage');
          return;
        }

        this.openPage('LoginPage');
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
    this.translateService.get('EXIT_APP_TEXT').subscribe(translate => {
      this.exitText = translate;
    });
    this.translateService.get('LOGOUT_PROFILE_TEXT').subscribe(translate => {
      this.logoutText = translate;
    });
  }

  openPage(p, rootPage: boolean = true) {
    if (rootPage) {
      this.nav.setRoot(p);
    } else {
      this.nav.push(p);
    }
  }

  logout() {
    this.authProvider.logout();
  }

  // Redirect user when login or logout
  private onUserLogin(): void {
    this.authProvider.onLogin$.takeUntil(this.unsubscriber$).subscribe(() => {
      this.profile = this.userDataProvider.currentProfile;
      this.network = this.userDataProvider.currentNetwork;

      return this.menuCtrl.enable(true, 'sidebarMenu');
    });
  }

  private onUserLogout(): void {
    this.authProvider.onLogout$.takeUntil(this.unsubscriber$).subscribe(() => {
      this.userDataProvider.clearCurrentWallet();

      this.menuCtrl.enable(false, 'sidebarMenu');
      return this.openPage('LoginPage');
    })
  }

  // Verify if any account registered is a delegate
  private onUpdateDelegates(delegates: arkts.Delegate[]) {
    lodash.flatMap(this.userDataProvider.profiles, (profile: Profile) => {
      let wallets = lodash.values(profile.wallets);
      return lodash.filter(wallets, { isDelegate: false });
    }).forEach((wallet: any) => {
      let find = lodash.find(delegates, { address: wallet['address'] });

      if (find) {
        wallet['isDelegate'] = true;
        wallet['username'] = find.username;

        this.userDataProvider.saveWallet(wallet, undefined, true);
      }
    });
  }

  // Verify if new wallet is a delegate
  private onCreateWallet() {
    return this.userDataProvider.onCreateWallet$
      .takeUntil(this.unsubscriber$)
      .debounceTime(500)
      .subscribe(() => {
        this.arkApiProvider.delegates.subscribe((delegates) => this.onUpdateDelegates(delegates))
      });
  }

  private showConfirmation(title: string, successCb: () => void, failureCb: () => void = () => {}, message: string = null): void {
    if (this.alert) {
      this.alert.dismiss();
      this.alert = null;

      return;
    }
    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.alert = null;
            failureCb();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.alert = null;
            successCb();
          }
        }
      ]
    });
    this.alert.present();
  }

  private initialVerify() {
    // if (lodash.isNil(this.localDataProvider.profiles)) {
    //   return this.openPage('LoginPage');
    // }
  }

  ngOnInit() {
    this.initialVerify();
    this.onUserLogin();
    this.onUserLogout();

    this.onCreateWallet();
    this.arkApiProvider.onUpdateDelegates$
      .do((delegates) => this.onUpdateDelegates(delegates))
      .takeUntil(this.unsubscriber$)
      .subscribe();

  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.authProvider.logout();
  }

}

