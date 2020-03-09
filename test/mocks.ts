import { Injectable } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Observable } from "rxjs";
import { StoredNetwork, Wallet, Profile } from '@/models/model';
import { IUserDataProvider } from '@/services/user-data/user-data.interface';

@Injectable()
export class SplashScreenMock extends SplashScreen {
	show(): void {}
	hide(): void {}
}

@Injectable()
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

@Injectable()
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

@Injectable()
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

@Injectable()
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

@Injectable()
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

@Injectable()
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

@Injectable()
export class UserDataProviderMock implements IUserDataProvider {
	public currentNetwork: StoredNetwork;
	public currentWallet: Wallet;
	public currentProfile: Profile;

	public profiles: Record<string, Profile>;
	public networks: Record<string, StoredNetwork>;
}
