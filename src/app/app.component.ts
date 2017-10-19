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

import lodash from 'lodash';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Wallet } from '@models/wallet';
import * as arkts from 'ark-ts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage = null;
  public profile = null;
  public network = null;

  private _unsubscriber$: Subject<void> = new Subject<void>();

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

  // Redirect user when login or logout
  private _onLogin() {
    this.authProvider.isLoginSubject$.takeUntil(this._unsubscriber$).subscribe((status) => {
      if (!status) {
        this.menuCtrl.enable(false, 'sidebarMenu');
        this.openPage('ProfileSigninPage');
      } else {
        this.profile = this.localDataProvider.profileActive;
        this.network = this.localDataProvider.networkActive;
        this.menuCtrl.enable(true, 'sidebarMenu');
      }
    });
  }

  // Verify if any account registered is a delegate
  private _onUpdateDelegates(delegates: arkts.Delegate[]) {
    lodash
      .flatMap(this.localDataProvider.profiles, (item) => {
        // Filter only non-delegates
        return lodash.filter(lodash.values(item['wallets']), { isDelegate: false });
      })
      .forEach((wallet: Wallet) => {
        // Search for a non-delegate in the delegates list
        let find = lodash.find(delegates, { address: wallet['address'] });
        if (find) {
          wallet.isDelegate = true;
          wallet.username = find.username;

          this.localDataProvider.walletSave(wallet, undefined, true);
        }
      });
  }

  // Verify if new wallet is a delegate
  private _onCreateWallet() {
    return this.localDataProvider.onCreateWallet$
      .takeUntil(this._unsubscriber$)
      .debounceTime(500)
      .subscribe(() => {
        this.arkApiProvider.delegates.subscribe((delegates) => this._onUpdateDelegates(delegates))
      });
  }

  private _initialVerify() {
    if (lodash.isEmpty(this.localDataProvider.profiles)) {
      this.openPage('LoginPage');
      return;
    }
  }

  ngOnInit() {
    this._initialVerify();
    this._onLogin();
    this._onCreateWallet();
    this.arkApiProvider.onUpdateDelegates$
      .do((delegates) => this._onUpdateDelegates(delegates))
      .takeUntil(this._unsubscriber$)
      .subscribe();

  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
    this.authProvider.logout();
  }

}

