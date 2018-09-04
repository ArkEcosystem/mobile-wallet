import { Component, ElementRef, Renderer2, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Platform, Config, Nav, MenuController, AlertController, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';
import { LocalNotificationsProvider } from '@providers/local-notifications/local-notifications';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import * as constants from '@app/app.constants';
import moment from 'moment';
import { Wallet } from '@models/wallet';

@Component({
  templateUrl: 'app.html',
  providers: [ScreenOrientation, Network],
})
export class MyApp implements OnInit, OnDestroy {
  public rootPage = 'LoginPage';
  public profile = null;
  public network = null;
  public hideNav = false;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private exitText = null;
  private signOutText = null;

  private lastPauseTimestamp: Date;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private authProvider: AuthProvider,
    private translateService: TranslateService,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private settingsDataProvider: SettingsDataProvider,
    private toastProvider: ToastProvider,
    private localNotificationsProvider: LocalNotificationsProvider,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private config: Config,
    private keyboard: Keyboard,
    private screenOrientation: ScreenOrientation,
    private app: App,
    private ionicNetwork: Network,
    private splashScreen: SplashScreen,
    private events: Events,
    public element: ElementRef,
    private renderer: Renderer2
  ) {

    platform.ready().then(() => {
      this.splashScreen.hide();
      menuCtrl.enable(false, 'sidebarMenu');

      this.initConfig();
      this.setBackButton();

      authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
        if (!hasSeenIntro) {
          this.openPage('IntroPage');
          return;
        }

        this.openPage('LoginPage');
      });

      this.events.subscribe('qrScanner:show', () => {
        this.hideNav = true;
      });
      this.events.subscribe('qrScanner:hide', () => {
        this.hideNav = false;
      });

      this.settingsDataProvider.onUpdate$.subscribe(() => {
        this.initTranslate();
        this.initTheme();
      });
    });

    this.initTranslate();
    this.initTheme();
  }

  setBackButton() {
    this.platform.registerBackButtonAction(() => {
      const overlay = this.app._appRoot._overlayPortal.getActive();
      if (overlay && overlay.dismiss) {
        return overlay.dismiss();
      }
      if (this.menuCtrl && this.menuCtrl.isOpen()) {
        return this.menuCtrl.close();
      }
      const navPromise = this.app.navPop();
      if (!navPromise) {
        if (this.nav.getActive().name === 'LoginPage' || this.nav.getActive().name === 'IntroPage') {
          this.showConfirmation(this.exitText).then(() => {
            this.platform.exitApp();
          });
        } else {
          this.showConfirmation(this.signOutText).then(() => {
            this.logout();
          });
        }
      }
    }, 500);
  }

  initConfig() {
    // all platforms
    this.config.set('scrollAssist', false);
    this.config.set('autoFocusAssist', false);

    // ios
    this.config.set('ios', 'scrollPadding', false);

    // android
    this.config.set('android', 'scrollAssist', false);
    this.config.set('android', 'autoFocusAssist', 'delay');

    if (this.platform.is('cordova')) {
      this.localNotificationsProvider.init();

      if (this.platform.is('ios')) {
        this.statusBar.styleDefault();
        this.keyboard.disableScroll(false);
      }

      if (this.platform.is('android')) {
        this.statusBar.show();
      }

      this.platform.pause.subscribe(() => {
        this.lastPauseTimestamp = moment().toDate();
      });

      this.platform.resume.subscribe(() => {
        const now = moment();
        const diff = now.diff(this.lastPauseTimestamp);

        if (diff >= constants.APP_TIMEOUT_DESTROY) {
          const overlay = this.app._appRoot._overlayPortal.getActive();
          if (overlay && overlay.dismiss) {
            overlay.dismiss();
          }
          if (this.menuCtrl && this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
          }
          this.app.navPop();
          this.logout();
        }
      });

      this.keyboard.hideKeyboardAccessoryBar(true);
      this.keyboard.onKeyboardShow().subscribe(() => document.body.classList.add('keyboard-is-open'));
      this.keyboard.onKeyboardHide().subscribe(() => document.body.classList.remove('keyboard-is-open'));

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translateService.setDefaultLang('en');
    this.settingsDataProvider.settings.subscribe(settings => {
      this.translateService.use(settings.language); // Set your language here

      this.translateService.get(['BACK_BUTTON_TEXT', 'EXIT_APP_TEXT', 'SIGN_OUT_PROFILE_TEXT']).subscribe(translations => {
        this.config.set('ios', 'backButtonText', translations['BACK_BUTTON_TEXT']);
        this.exitText = translations['EXIT_APP_TEXT'];
        this.signOutText = translations['SIGN_OUT_PROFILE_TEXT'];
      });
    });
  }

  initTheme() {
    this.settingsDataProvider.settings.subscribe(settings => {
      if (settings.darkMode) {
        this.renderer.addClass(this.element.nativeElement.parentNode, 'dark-theme');
      } else {
        this.renderer.removeClass(this.element.nativeElement.parentNode, 'dark-theme');
      }
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
    });
  }

  // Verify if new wallet is a delegate
  private onCreateWallet() {
    return this.userDataProvider.onCreateWallet$
      .takeUntil(this.unsubscriber$)
      .debounceTime(500)
      .subscribe((wallet: Wallet) => {
        this.arkApiProvider
            .getDelegateByPublicKey(wallet.publicKey)
            .subscribe(delegate => this.userDataProvider.ensureWalletDelegateProperties(wallet, delegate));
      });
  }

  private showConfirmation(title: string): Promise<void> {
    return new Promise((resolve) => {
      this.translateService.get(['NO', 'YES']).subscribe((translation) => {
        const alert = this.alertCtrl.create({
          subTitle: title,
          buttons: [
            {
              text: translation.NO,
              role: 'cancel',
              handler: () => {}
            },
            {
              text: translation.YES,
              handler: () => resolve()
            }
          ]
        });
        alert.present();
      });
    });
  }

  private verifyNetwork() {
    this.ionicNetwork
      .onDisconnect()
      .takeUntil(this.unsubscriber$)
      .subscribe(() => this.toastProvider.error('NETWORKS_PAGE.INTERNET_DESCONNECTED'));
  }

  ngOnInit() {
    this.onUserLogin();
    this.onUserLogout();
    this.verifyNetwork();

    this.onCreateWallet();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.authProvider.logout();
  }
}
