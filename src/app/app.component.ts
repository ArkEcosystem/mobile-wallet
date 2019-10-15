// import { Component, ElementRef, Renderer2, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { Platform, Config, IonNav, MenuController, AlertController, Events } from '@ionic/angular';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { Keyboard } from '@ionic-native/keyboard/ngx';
// import { Network } from '@ionic-native/network/ngx';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// import { AuthProvider } from '@/services/auth/auth';
// import { UserDataProvider } from '@/services/user-data/user-data';
// import { SettingsDataProvider } from '@/services/settings-data/settings-data';
// import { ArkApiProvider } from '@/services/ark-api/ark-api';
// import { ToastProvider } from '@/services/toast/toast';
// // import { LocalNotificationsProvider } from '@providers/local-notifications/local-notifications';

// import { TranslateService } from '@ngx-translate/core';

// import { Subject } from 'rxjs/Subject';
// import 'rxjs/add/operator/takeUntil';

// import * as constants from '@/app/app.constants';
// import moment from 'moment';
// import { Wallet } from '@/models/wallet';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   templateUrl: 'app.component.html',
//   providers: [ScreenOrientation, Network],
// })
// export class AppComponent implements OnInit, OnDestroy {
//   public rootPage = '/login';
//   public profile = null;
//   public network = null;
//   public hideNav = false;

//   private unsubscriber$: Subject<void> = new Subject<void>();
//   private exitText = null;
//   private signOutText = null;

//   private lastPauseTimestamp: Date;

//   @ViewChild('nav', { read: IonNav, static: true }) nav: IonNav;

//   constructor(
//     private platform: Platform,
//     private statusBar: StatusBar,
//     private authProvider: AuthProvider,
//     private translateService: TranslateService,
//     private userDataProvider: UserDataProvider,
//     private arkApiProvider: ArkApiProvider,
//     private settingsDataProvider: SettingsDataProvider,
//     private toastProvider: ToastProvider,
//     // private localNotificationsProvider: LocalNotificationsProvider,
//     private menuCtrl: MenuController,
//     private alertCtrl: AlertController,
//     private config: Config,
//     private keyboard: Keyboard,
//     private screenOrientation: ScreenOrientation,
//     // private app: App,
//     private ionicNetwork: Network,
//     private splashScreen: SplashScreen,
//     private events: Events,
//     public element: ElementRef,
//     private renderer: Renderer2,
//     private route: ActivatedRoute
//   ) {
//     debugger
//     platform.ready().then(() => {
//       this.splashScreen.hide();
//       menuCtrl.enable(false, 'sidebarMenu');

//       this.initConfig();
//       this.setBackButton();

//       authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
//         if (!hasSeenIntro) {
//           this.openPage('IntroPage');
//           return;
//         }

//         this.openPage('LoginPage');
//       });

//       this.events.subscribe('qrScanner:show', () => {
//         this.hideNav = true;
//       });
//       this.events.subscribe('qrScanner:hide', () => {
//         this.hideNav = false;
//       });

//       this.settingsDataProvider.onUpdate$.subscribe(() => {
//         this.initTranslate();
//         this.initTheme();
//       });
//     });

//     this.initTranslate();
//     this.initTheme();
//   }

//   setBackButton() {
//     this.platform.backButton.subscribeWithPriority(0, () => {
//       // const overlay = this.app._appRoot._overlayPortal.getActive();
//       // if (overlay && overlay.dismiss) {
//       //   return overlay.dismiss();
//       // }
//       if (this.menuCtrl && this.menuCtrl.isOpen()) {
//         return this.menuCtrl.close();
//       }
//       const navPromise = this.nav.pop();
//       if (!navPromise) {
//         this.route.url.subscribe(url => {
//           const path = url[0].path;
//           if (path === '/login' || path === '/intro') {
//             this.showConfirmation(this.exitText).then(() => {
//               navigator['app'].exitApp();
//             });
//           } else {
//             this.showConfirmation(this.signOutText).then(() => {
//               this.logout();
//             });
//           }
//         })
//       }
//     });
//   }

//   initConfig() {
//     // all platforms
//     this.config.set('scrollAssist', false);
//     // this.config.set('autoFocusAssist', false);

//     // ios
//     // this.config.set('ios', 'scrollPadding', false);

//     // android
//     // this.config.set('android', 'scrollAssist', false);
//     // this.config.set('android', 'autoFocusAssist', 'delay');

//     if (this.platform.is('cordova')) {
//       // this.localNotificationsProvider.init();

//       if (this.platform.is('ios')) {
//         this.statusBar.styleDefault();
//       }

//       if (this.platform.is('android')) {
//         this.statusBar.show();
//       }

//       this.platform.pause.subscribe(() => {
//         this.lastPauseTimestamp = moment().toDate();
//       });

//       this.platform.resume.subscribe(() => {
//         const now = moment();
//         const diff = now.diff(this.lastPauseTimestamp);

//         if (diff >= constants.APP_TIMEOUT_DESTROY) {
//           // const overlay = this.app._appRoot._overlayPortal.getActive();
//           // if (overlay && overlay.dismiss) {
//           //   overlay.dismiss();
//           // }
//           if (this.menuCtrl && this.menuCtrl.isOpen()) {
//             this.menuCtrl.close();
//           }
//           this.nav.pop();
//           this.logout();
//         }
//       });

//       this.keyboard.onKeyboardShow().subscribe(() => document.body.classList.add('keyboard-is-open'));
//       this.keyboard.onKeyboardHide().subscribe(() => document.body.classList.remove('keyboard-is-open'));

//       this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
//     }
//   }

//   initTranslate() {
//     // Set the default language for translation strings, and the current language.
//     this.translateService.setDefaultLang('en');
//     this.settingsDataProvider.settings.subscribe(settings => {
//       this.translateService.use(settings.language); // Set your language here

//       this.translateService.get(['BACK_BUTTON_TEXT', 'EXIT_APP_TEXT', 'SIGN_OUT_PROFILE_TEXT']).subscribe(translations => {
//         this.config.set('backButtonText', translations['BACK_BUTTON_TEXT']);
//         this.exitText = translations['EXIT_APP_TEXT'];
//         this.signOutText = translations['SIGN_OUT_PROFILE_TEXT'];
//       });
//     });
//   }

//   initTheme() {
//     this.settingsDataProvider.settings.subscribe(settings => {
//       if (settings.darkMode) {
//         this.renderer.addClass(this.element.nativeElement.parentNode, 'dark-theme');
//       } else {
//         this.renderer.removeClass(this.element.nativeElement.parentNode, 'dark-theme');
//       }
//     });
//   }

//   openPage(p, rootPage: boolean = true) {
//     if (rootPage) {
//       this.nav.setRoot(p);
//     } else {
//       this.nav.push(p);
//     }
//   }

//   logout() {
//     this.authProvider.logout();
//   }

//   // Redirect user when login or logout
//   private onUserLogin(): void {
//     this.authProvider.onLogin$.takeUntil(this.unsubscriber$).subscribe(() => {
//       this.profile = this.userDataProvider.currentProfile;
//       this.network = this.userDataProvider.currentNetwork;

//       return this.menuCtrl.enable(true, 'sidebarMenu');
//     });
//   }

//   private onUserLogout(): void {
//     this.authProvider.onLogout$.takeUntil(this.unsubscriber$).subscribe(() => {
//       this.userDataProvider.clearCurrentWallet();

//       this.menuCtrl.enable(false, 'sidebarMenu');
//       return this.openPage('LoginPage');
//     });
//   }

//   // Verify if new wallet is a delegate
//   private onCreateWallet() {
//     return this.userDataProvider.onCreateWallet$
//       .takeUntil(this.unsubscriber$)
//       .debounceTime(500)
//       .subscribe((wallet: Wallet) => {
//         this.arkApiProvider
//             .getDelegateByPublicKey(wallet.publicKey)
//             .subscribe(delegate => this.userDataProvider.ensureWalletDelegateProperties(wallet, delegate));
//       });
//   }

//   private async showConfirmation(title: string): Promise<void> {
//     return new Promise((resolve) => {
//       this.translateService.get(['NO', 'YES']).subscribe(async (translation) => {
//         const alert = await this.alertCtrl.create({
//           subHeader: title,
//           buttons: [
//             {
//               text: translation.NO,
//               role: 'cancel',
//               handler: () => {}
//             },
//             {
//               text: translation.YES,
//               handler: () => resolve()
//             }
//           ]
//         });
//         alert.present();
//       });
//     });
//   }

//   private verifyNetwork() {
//     this.ionicNetwork
//       .onDisconnect()
//       .takeUntil(this.unsubscriber$)
//       .subscribe(() => this.toastProvider.error('NETWORKS_PAGE.INTERNET_DESCONNECTED'));
//   }

//   ngOnInit() {
//     this.onUserLogin();
//     this.onUserLogout();
//     this.verifyNetwork();

//     this.onCreateWallet();
//   }

//   ngOnDestroy() {
//     this.unsubscriber$.next();
//     this.unsubscriber$.complete();
//     this.authProvider.logout();
//   }
// }

import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private translateService: TranslateService
  ) {
    this.initializeApp();
    this.initializeTranslation();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.navController.navigateForward('/intro')
    });
  }

  initializeTranslation() {
    this.translateService.setDefaultLang('en');
  }
}
