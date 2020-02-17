import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Observable } from "rxjs";

export class SplashScreenMock extends SplashScreen {
	show(): void {}
	hide(): void {}
}

export class StatusBarMock extends StatusBar {
	isVisible: boolean;
	overlaysWebView(doesOverlay: boolean): void {}
	styleDefault(): void {}
	styleLightContent(): void {}
	styleBlackTranslucent(): void {}
	styleBlackOpaque(): void {}
	backgroundColorByName(colorName: string): void {}
	backgroundColorByHexString(hexString: string): void {}
	hide(): void {}
	show(): void {}
}

export class QRScannerMock extends QRScanner {
	prepare(): Promise<QRScannerStatus> {
		return Promise.resolve(undefined);
	}

	scan(): Observable<string> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}

	show(): Promise<QRScannerStatus> {
		return Promise.resolve(undefined);
	}

	hide(): Promise<QRScannerStatus> {
		return Promise.resolve(undefined);
	}

	openSettings(): void {}
}

export class KeyboardMock extends Keyboard {
	hideKeyboardAccessoryBar(hide: boolean): void {}
	show(): void {}
	close(): void {}
	disableScroll(disable: boolean): void {}
	onKeyboardShow(): Observable<any> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}
	onKeyboardHide(): Observable<any> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}
}

export class NetworkMock extends Network {
	type = "cellular";
	downlinkMax: string;
	onchange(): Observable<any> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}
	onDisconnect(): Observable<any> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}
	onConnect(): Observable<any> {
		return new Observable(observer => {
			observer.next("");
			observer.complete();
		});
	}
}

export class SocialSharingMock extends SocialSharing {
	share(
		message?: string,
		subject?: string,
		file?: string | string[],
		url?: string,
	): Promise<any> {
		return Promise.resolve();
	}
}

export class ScreenOrientationMock extends ScreenOrientation {
	type: string;
	ORIENTATIONS: {
		PORTRAIT_PRIMARY: string;
		PORTRAIT_SECONDARY: string;
		LANDSCAPE_PRIMARY: string;
		LANDSCAPE_SECONDARY: string;
		PORTRAIT: string;
		LANDSCAPE: string;
		ANY: string;
	};
	onChange(): Observable<void> {
		return new Observable(observer => {
			observer.complete();
		});
	}
	lock(orientation: string): Promise<any> {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	unlock(): void {}
}
