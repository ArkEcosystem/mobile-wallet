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
import { ChartsModule } from "ng2-charts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GlobalErrorHandlerService } from "./services/error-handler/error-handler.service";
import { UserDataServiceImpl } from "./services/user-data/user-data";
import { UserDataService } from "./services/user-data/user-data.interface";

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
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
		AppRoutingModule,
		ChartsModule,
		HammerModule,
	],
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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
