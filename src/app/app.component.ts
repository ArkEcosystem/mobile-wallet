import { Component, OnDestroy, OnInit, Renderer2, ElementRef } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ToastProvider } from '@/services/toast/toast';
import { AuthProvider } from '@/services/auth/auth';
import { UserDataProvider } from '@/services/user-data/user-data';
import { Wallet } from '@/models/model';
import { ArkApiProvider } from './services/ark-api/ark-api';
import { SettingsDataProvider } from './services/settings-data/settings-data';
import { EventBusProvider } from './services/event-bus/event-bus';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  private profile = null;
  private network = null;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private exitText: string;
  private signOutText: string;
  private hideRouter = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private translateService: TranslateService,
    private ionicNetwork: Network,
    private toastProvider: ToastProvider,
    private authProvider: AuthProvider,
    private menuCtrl: MenuController,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private settingsDataProvider: SettingsDataProvider,
    public element: ElementRef,
    private renderer: Renderer2,
    private eventBus: EventBusProvider,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initTranslation();
      this.initTheme();
      this.initalConfig();
    
      this.splashScreen.hide();

      this.authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
        if (!hasSeenIntro) {
          this.openPage('/intro', true);
          return;
        }

        this.openPage('/login', true);
      });
    });
  }

  initTranslation() {
    this.translateService.setDefaultLang('en');
    this.settingsDataProvider.settings.subscribe(settings => {
      this.translateService.use(settings.language);

      this.translateService.get(['BACK_BUTTON_TEXT', 'EXIT_APP_TEXT', 'SIGN_OUT_PROFILE_TEXT']).subscribe(translations => {
        // this.config.set('backButtonText', translations['BACK_BUTTON_TEXT']);
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

  initalConfig() {
    this.statusBar.styleDefault();
    this.menuCtrl.enable(false, 'sidebar');
    
    this.eventBus.$subject.subscribe((event) => {
      switch (event.key) {
        case 'qrScanner:show':
          this.hideRouter = true;
          break;
        case 'qrScanner:hide':
          this.hideRouter = false;
          break;
      }
    });
  }

  openPage(path: string, rootPage: boolean = true) {
    this.menuCtrl.close();
    if (rootPage) {
      this.navController.navigateRoot(path);
    } else {
      this.navController.navigateForward(path);
    }
  }

  logout() {
    this.authProvider.logout();
  }

  // Verify if new wallet is a delegate
  private onCreateWallet() {
    return this.userDataProvider.onCreateWallet$
      .pipe(
        takeUntil(this.unsubscriber$),
        debounceTime(500)
      )
      .subscribe((wallet: Wallet) => {
        this.arkApiProvider
            .getDelegateByPublicKey(wallet.publicKey)
            .subscribe(delegate => this.userDataProvider.ensureWalletDelegateProperties(wallet, delegate));
      });
  }

  // Redirect user when login or logout
  private onUserLogin(): void {
    this.authProvider.onLogin$.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
      this.profile = this.userDataProvider.currentProfile;
      this.network = this.userDataProvider.currentNetwork;

      return this.menuCtrl.enable(true, 'sidebar');
    });
  }

  private onUserLogout(): void {
    this.authProvider.onLogout$.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
      this.userDataProvider.clearCurrentWallet();

      this.menuCtrl.enable(false, 'sidebar');
      return this.openPage('/login');
    });
  }

  private verifyNetwork() {
    this.ionicNetwork
      .onDisconnect()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => this.toastProvider.error('NETWORKS_PAGE.INTERNET_DESCONNECTED'));
  }

  ngOnInit() {
    this.onUserLogin();
    this.onUserLogout();
    this.verifyNetwork();

    this.onCreateWallet();

    this.settingsDataProvider.onUpdate$.subscribe(() => {
      this.initTranslation();
      this.initTheme();
    });
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.authProvider.logout();
  }
}
