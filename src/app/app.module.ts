import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule, HammerModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy } from "@angular/router";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { NgxsModule } from "@ngxs/store";
import { ChartsModule } from "ng2-charts";

import { PipesModule } from "@/pipes/pipes.module";

import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { AuthConfig } from "./auth/shared/auth.config";
import { DelegateService } from "./delegates/shared/delegate.service";
import { DelegateServiceMock } from "./delegates/shared/delegate.service.mock";
import { MarketModule } from "./market/market.module";
import { MarketConfig } from "./market/shared/market.config";
import { OnboardingConfig } from "./onboarding/shared/onboarding.config";
import { GlobalErrorHandlerService } from "./services/error-handler/error-handler.service";
import { UserDataServiceImpl } from "./services/user-data/user-data";
import { UserDataService } from "./services/user-data/user-data.interface";
import { SettingsConfig } from "./settings/shared/settings.config";
import { SettingsState } from "./settings/shared/settings.state";
import { NgxsAsyncStoragePluginModule } from "./shared/state/async-storage/async-storage.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { WalletModule } from "./wallets/wallet/wallet.module";

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		NgxsModule.forRoot([SettingsState], {
			developmentMode: !environment.production,
		}),
		NgxsAsyncStoragePluginModule.forRoot({
			keys: [
				AuthConfig.STORAGE_KEY,
				OnboardingConfig.STORAGE_KEY,
				MarketConfig.STORAGE_KEY,
				SettingsConfig.STORAGE_KEY,
			],
		}),
		NgxsRouterPluginModule.forRoot(),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
		}),
		AuthModule,
		WalletModule,
		TransactionsModule,
		MarketModule,
		ChartsModule,
		HammerModule,
		PipesModule,
		AppRoutingModule,
	],
	exports: [TranslateModule],
	providers: [
		StatusBar,
		SplashScreen,
		QRScanner,
		Keyboard,
		SocialSharing,
		Network,
		ScreenOrientation,
		GlobalErrorHandlerService,
		{ provide: UserDataService, useClass: UserDataServiceImpl },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },
		// TODO: Remove mock
		{ provide: DelegateService, useClass: DelegateServiceMock },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
