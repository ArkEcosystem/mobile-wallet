import { Injectable } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Delegate, Network as ArkNetwork } from "ark-ts";
import { Observable, of, Subject } from "rxjs";

import { Profile, StoredNetwork, Wallet, WalletKeys } from "@/models/model";
import { UserDataService } from "@/services/user-data/user-data.interface";

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
		return new Observable((observer) => {
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
		return new Observable((observer) => {
			observer.next("");
			observer.complete();
		});
	}
	onKeyboardHide(): Observable<any> {
		return new Observable((observer) => {
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
		return new Observable((observer) => {
			observer.next("");
			observer.complete();
		});
	}
	onDisconnect(): Observable<any> {
		return new Observable((observer) => {
			observer.next("");
			observer.complete();
		});
	}
	onConnect(): Observable<any> {
		return new Observable((observer) => {
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
		return new Observable((observer) => {
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

const generateMockProfile = () => {
	const userProfile = new Profile();
	userProfile.contacts = [];
	userProfile.name = "Test profile";
	userProfile.networkId = "30";
	userProfile.wallets = [];

	return userProfile;
};

@Injectable()
export class UserDataProviderMock implements UserDataService {
	public currentNetwork: StoredNetwork;
	public currentWallet: Wallet;
	public currentProfile: Profile;
	public profiles: Record<string, Profile>;
	public networks: Record<string, StoredNetwork>;
	public onActivateNetwork$: Subject<StoredNetwork>;
	public onUpdateNetwork$: Subject<StoredNetwork>;
	public onCreateWallet$: Subject<Wallet>;
	public onUpdateWallet$: Subject<Wallet>;
	public onSelectProfile$: Subject<Profile>;

	constructor() {
		const mockProfile = generateMockProfile();
		this.profiles = { ["test_profile_id"]: mockProfile };
		this.currentProfile = mockProfile;
	}

	public get isDevNet(): boolean {
		throw new Error("Method not implemented.");
	}
	public get isMainNet(): boolean {
		throw new Error("Method not implemented.");
	}
	public get defaultNetworks(): ArkNetwork[] {
		throw new Error("Method not implemented.");
	}
	public addOrUpdateNetwork(
		network: StoredNetwork,
		networkId?: string,
	): Observable<{ network: ArkNetwork; id: string }> {
		throw new Error("Method not implemented.");
	}
	public getNetworkById(networkId: string): StoredNetwork {
		throw new Error("Method not implemented.");
	}
	public removeNetworkById(networkId: string): Observable<boolean> {
		throw new Error("Method not implemented.");
	}
	public addProfile(profile: Profile): Observable<boolean> {
		throw new Error("Method not implemented.");
	}
	public getProfileByName(name: string): Profile {
		throw new Error("Method not implemented.");
	}
	public getProfileById(profileId: string): Profile {
		throw new Error("Method not implemented.");
	}
	public removeProfileById(profileId: string): Observable<boolean> {
		throw new Error("Method not implemented.");
	}
	public saveProfiles(profiles?: { [key: string]: any }) {
		if (profiles) {
			this.profiles = profiles;
		}

		return of(true);
	}
	public setCurrentProfile(
		profileId: string,
		broadcast: boolean = true,
	): void {
		this.currentProfile = this.profiles[profileId];
	}

	public encryptSecondPassphrase(
		wallet: Wallet,
		pinCode: string,
		secondPassphrase: string,
		profileId?: string,
	) {
		throw new Error("Method not implemented.");
	}
	public addWallet(
		wallet: Wallet,
		passphrase: string,
		pinCode: string,
		profileId?: string,
	) {
		throw new Error("Method not implemented.");
	}
	public updateWalletEncryption(oldPassword: string, newPassword: string) {
		throw new Error("Method not implemented.");
	}
	public removeWalletByAddress(
		address: string,
		profileId?: string,
	): Observable<boolean> {
		throw new Error("Method not implemented.");
	}
	public ensureWalletDelegateProperties(
		wallet: Wallet,
		delegateOrUserName: string | Delegate,
	): Observable<boolean> {
		throw new Error("Method not implemented.");
	}
	public getWalletByAddress(address: string, profileId?: string): Wallet {
		throw new Error("Method not implemented.");
	}
	public updateWallet(
		wallet: Wallet,
		profileId: string,
		notificate?: boolean,
	): Observable<any> {
		throw new Error("Method not implemented.");
	}
	public saveWallet(
		wallet: Wallet,
		profileId?: string,
		notificate?: boolean,
	) {
		throw new Error("Method not implemented.");
	}
	public setWalletLabel(wallet: Wallet, label: string): Observable<any> {
		throw new Error("Method not implemented.");
	}
	public getWalletLabel(
		walletOrAddress: string | Wallet,
		profileId?: string,
	): string {
		throw new Error("Method not implemented.");
	}
	public setCurrentWallet(wallet: Wallet): void {
		throw new Error("Method not implemented.");
	}
	public clearCurrentWallet(): void {
		throw new Error("Method not implemented.");
	}
	public loadProfiles(): Observable<Record<string, Profile>> {
		throw new Error("Method not implemented.");
	}
	public loadNetworks(): Observable<Record<string, StoredNetwork>> {
		throw new Error("Method not implemented.");
	}
	public getKeysByWallet(wallet: Wallet, password: string): WalletKeys {
		throw new Error("Method not implemented.");
	}
}
