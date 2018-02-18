import { Storage, IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Custom providers
import { StorageProvider } from '@providers/storage/storage';
import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { NetworkProvider } from '@providers/network/network';
import { ContactsProvider } from '@providers/contacts/contacts';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ToastProvider } from '@providers/toast/toast';
import { ForgeProvider } from '@providers/forge/forge';
import { ContactsAutoCompleteService } from '@providers/contacts-auto-complete/contacts-auto-complete';

// Ionic native
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { QRScanner } from '@ionic-native/qr-scanner';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';

import '@root/node_modules/chart.js/src/chart.js';
import { AutoCompleteModule } from 'ionic2-auto-complete';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AutoCompleteModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // Ionic native
    StatusBar,
    SplashScreen,
    Keyboard,
    QRScanner,
    SocialSharing,
    // Custom providers
    {provide: StorageProvider, useClass: StorageProvider, deps: [Storage]},
    {provide: AuthProvider, useClass: AuthProvider, deps: [StorageProvider]},
    UserDataProvider,
    NetworkProvider,
    ContactsProvider,
    ArkApiProvider,
    MarketDataProvider,
    SettingsDataProvider,
    ForgeProvider,
    ToastProvider,
    ContactsAutoCompleteService
  ]
})
export class AppModule {}
