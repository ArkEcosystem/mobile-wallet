import { SharedModule } from "@/app/shared.module";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
	ComponentFixture,
	TestBed,
	TestBedStatic,
} from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import {
	KeyboardMock,
	NetworkMock,
	QRScannerMock,
	ScreenOrientationMock,
	SocialSharingMock,
	SplashScreenMock,
	StatusBarMock,
} from "./mocks";

interface Compilation<T> {
	fixture: ComponentFixture<T>;
	component: T;
}

export class TestHelpers {
	public static async beforeEachCompiler<T>(
		components: Array<any>,
	): Promise<Compilation<T>> {
		const testingModule = TestHelpers.configureIonicTestingModule(
			components,
		);

		await testingModule.compileComponents();

		const fixture = TestBed.createComponent<T>(components[0]);
		const component = fixture.componentInstance;

		return { fixture, component };
	}

	public static configureIonicTestingModule(
		components: Array<any>,
	): TestBedStatic {
		return TestBed.configureTestingModule({
			declarations: [...components],
			imports: [
				IonicModule,
				IonicStorageModule.forRoot(),
				BrowserModule,
				HttpClientModule,
				TranslateModule.forRoot(),
				SharedModule,
				RouterModule.forRoot([]),
			],
			providers: [
				{ provide: APP_BASE_HREF, useValue: "/" },
				{ provide: SplashScreen, useClass: SplashScreenMock },
				{ provide: StatusBar, useClass: StatusBarMock },
				{ provide: QRScanner, useClass: QRScannerMock },
				{ provide: Network, useClass: NetworkMock },
				{ provide: Keyboard, useClass: KeyboardMock },
				{ provide: ScreenOrientation, useClass: ScreenOrientationMock },
				{ provide: SocialSharing, useClass: SocialSharingMock },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		});
	}
}
