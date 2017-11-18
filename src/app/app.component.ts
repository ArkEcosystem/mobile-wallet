import { Component, ViewChild } from '@angular/core';
import { Platform, Config, Nav, MenuController } from 'ionic-angular';
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
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage = 'IntroPage';
  public profile = null;
  public network = null;

  private unsubscriber$: Subject<void> = new Subject<void>();

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
    private config: Config,
    private keyboard: Keyboard,
    private screenOrientation: ScreenOrientation,
  ) {
    platform.ready().then(() => {
      this.menuCtrl.enable(false, 'sidebarMenu');
      statusBar.styleDefault();
      keyboard.disableScroll(false);
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

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

