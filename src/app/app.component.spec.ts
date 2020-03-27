import { RouterModule } from "@angular/router";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, NavController } from "@ionic/angular";
import {
	byTestId,
	createComponentFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { of, Subject } from "rxjs";

import { AppComponent } from "./app.component";
import { ArkApiProvider } from "./services/ark-api/ark-api";
import { AuthProvider } from "./services/auth/auth";
import { EventBusProvider } from "./services/event-bus/event-bus";
import { SettingsDataProvider } from "./services/settings-data/settings-data";
import { UserDataService } from "./services/user-data/user-data.interface";

describe("App Component", () => {
	let spectator: Spectator<AppComponent>;
	const createComponent = createComponentFactory({
		component: AppComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			RouterModule.forRoot([]),
		],
		mocks: [
			SplashScreen,
			StatusBar,
			NavController,
			ArkApiProvider,
			ScreenOrientation,
			Keyboard,
		],
		providers: [
			mockProvider(UserDataService, {
				onCreateWallet$: new Subject(),
			}),
			mockProvider(AuthProvider, {
				onLogin$: new Subject(),
				onLogout$: new Subject(),
			}),
			mockProvider(SettingsDataProvider, {
				settings: of({}),
				onUpdate$: new Subject(),
			}),
			mockProvider(Network, {
				onDisconnect: () => new Subject(),
			}),
			mockProvider(EventBusProvider, {
				$subject: new Subject(),
			}),
		],
	});

	beforeEach(() => (spectator = createComponent()));

	it("should create", () => {
		expect(spectator.query(byTestId("c-app"))).toBeVisible();
	});
});
