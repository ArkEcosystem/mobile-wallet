import { Injectable } from "@angular/core";
import { Delegate } from "ark-ts";
import { Network, NetworkType } from "ark-ts/model";
import * as lodash from "lodash";
import { EMPTY, Observable, Subject, throwError } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { v4 as uuid } from "uuid";

import * as constants from "@/app/app.constants";
import { Contact, Profile, Wallet, WalletKeys } from "@/models/model";
import { StoredNetwork } from "@/models/stored-network";
import { TranslatableObject } from "@/models/translate";
import { AuthProvider } from "@/services/auth/auth";
import { ForgeProvider } from "@/services/forge/forge";
import { StorageProvider } from "@/services/storage/storage";

import { UserDataService } from "./user-data.interface";

@Injectable()
export class UserDataServiceImpl implements UserDataService {
	public get isDevNet(): boolean {
		return (
			this.currentNetwork &&
			this.currentNetwork.type === NetworkType.Devnet
		);
	}

	public get isMainNet(): boolean {
		return (
			this.currentNetwork &&
			this.currentNetwork.type === NetworkType.Mainnet
		);
	}

	public get defaultNetworks(): Network[] {
		if (!this._defaultNetworks) {
			this._defaultNetworks = Network.getAll();
		}
		return this._defaultNetworks;
	}

	public profiles: { [key: string]: Profile } = {};
	public networks: Record<string, StoredNetwork> = {};

	public currentProfile: Profile;
	public currentNetwork: StoredNetwork;
	public currentWallet: Wallet;

	public onActivateNetwork$: Subject<StoredNetwork> = new Subject();
	public onUpdateNetwork$: Subject<StoredNetwork> = new Subject();
	public onCreateWallet$: Subject<Wallet> = new Subject();
	public onUpdateWallet$: Subject<Wallet> = new Subject();
	public onSelectProfile$: Subject<Profile> = new Subject();

	private _defaultNetworks: Network[];

	constructor(
		private storageProvider: StorageProvider,
		private authProvider: AuthProvider,
		private forgeProvider: ForgeProvider,
	) {
		this.loadAllData();

		this.onLogin();
		this.onClearStorage();

		this.onUpdateNetwork$.subscribe(
			(network) => (this.currentNetwork = network),
		);
	}

	// this method is required to "migrate" contacts, in the first version of the app the contact's didnt't include an address property
	private static mapContact = (
		contacts: { [address: string]: Contact },
		contact: Contact,
		address: string,
	): void => {
		contact.address = address;
		contacts[address] = contact;
	};

	addOrUpdateNetwork(
		network: StoredNetwork,
		networkId?: string,
	): Observable<{ network: Network; id: string }> {
		if (!networkId) {
			networkId = this.generateUniqueId();
		}

		const { [networkId]: _, ...networks } = this.networks;
		networks[networkId] = network;
		this.networks = networks;

		return this.storageProvider
			.set(constants.STORAGE_NETWORKS, this.networks)
			.pipe(
				map(() => {
					return {
						network: this.networks[networkId],
						id: networkId,
					};
				}),
			);
	}

	getNetworkById(networkId: string): StoredNetwork {
		return this.networks[networkId];
	}

	removeNetworkById(networkId: string) {
		const { [networkId]: _, ...networks } = this.networks;
		this.networks = networks;
		return this.storageProvider.set(
			constants.STORAGE_NETWORKS,
			this.networks,
		);
	}

	addProfile(profile: Profile) {
		this.profiles[this.generateUniqueId()] = profile;

		return this.saveProfiles();
	}

	getProfileByName(name: string) {
		const profile = lodash.find(
			this.profiles,
			(id: any) => id.name.toLowerCase() === name.toLowerCase(),
		);
		if (profile) {
			return new Profile().deserialize(profile);
		}
	}

	getProfileById(profileId: string) {
		if (this.profiles[profileId]) {
			return new Profile().deserialize(this.profiles[profileId]);
		}
	}

	removeProfileById(profileId: string) {
		const { [profileId]: _, ...profiles } = this.profiles;
		this.profiles = profiles;

		return this.saveProfiles();
	}

	saveProfiles(profiles = this.profiles) {
		const currentProfile = this.authProvider.loggedProfileId;

		if (currentProfile) {
			this.setCurrentProfile(currentProfile, false);
		}
		return this.storageProvider.set(constants.STORAGE_PROFILES, profiles);
	}

	encryptSecondPassphrase(
		wallet: Wallet,
		pinCode: string,
		secondPassphrase: string,
		profileId: string = this.authProvider.loggedProfileId,
	) {
		if (lodash.isUndefined(profileId)) {
			return;
		}

		if (wallet && !wallet.cipherSecondKey) {
			// wallet.secondBip38 = this.forgeProvider.encryptBip38(secondWif, pinCode, this.currentNetwork);
			wallet.cipherSecondKey = this.forgeProvider.encrypt(
				secondPassphrase,
				pinCode,
				wallet.address,
				wallet.iv,
			);
			return this.updateWallet(wallet, profileId, true);
		}

		return this.saveProfiles();
	}

	addWallet(
		wallet: Wallet,
		passphrase: string,
		pinCode: string,
		profileId: string = this.authProvider.loggedProfileId,
	) {
		if (lodash.isUndefined(profileId)) {
			return throwError("EMPTY_PROFILE_ID");
		}

		const profile = this.getProfileById(profileId);

		if (!profile) {
			return throwError("PROFILE_NOT_FOUND");
		}

		if (passphrase) {
			const iv = this.forgeProvider.generateIv();
			wallet.iv = iv;
			const cipherKey = this.forgeProvider.encrypt(
				passphrase,
				pinCode,
				wallet.address,
				iv,
			);
			// wallet.bip38 = this.forgeProvider.encryptBip38(wif, pinCode, this.currentNetwork);
			wallet.cipherKey = cipherKey;
		}

		if (
			!profile.wallets[wallet.address] ||
			profile.wallets[wallet.address].isWatchOnly
		) {
			this.onCreateWallet$.next(wallet);
			return this.saveWallet(wallet, profileId, true);
		}

		return this.saveProfiles();
	}

	updateWalletEncryption(oldPassword: string, newPassword: string) {
		for (const profileId in this.profiles) {
			if (profileId) {
				const profile = this.profiles[profileId];
				for (const walletId in profile.wallets) {
					if (walletId) {
						const wallet = profile.wallets[walletId];
						if (wallet.isWatchOnly) {
							continue;
						}
						const key = this.forgeProvider.decrypt(
							wallet.cipherKey,
							oldPassword,
							wallet.address,
							wallet.iv,
						);
						wallet.cipherKey = this.forgeProvider.encrypt(
							key,
							newPassword,
							wallet.address,
							wallet.iv,
						);
						// wallet.bip38 = this.forgeProvider.encryptBip38(wif, newPassword, this.currentNetwork);

						if (wallet.cipherSecondKey) {
							const secondKey = this.forgeProvider.decrypt(
								wallet.cipherSecondKey,
								oldPassword,
								wallet.address,
								wallet.iv,
							);
							wallet.cipherSecondKey = this.forgeProvider.encrypt(
								secondKey,
								newPassword,
								wallet.address,
								wallet.iv,
							);
							// wallet.secondBip38 = this.forgeProvider.encryptBip38(secondWif, newPassword, this.currentNetwork);
						}

						this.updateWallet(wallet, profileId);
					}
				}
			}
		}

		return this.saveProfiles();
	}

	removeWalletByAddress(
		address: string,
		profileId: string = this.authProvider.loggedProfileId,
	): Observable<boolean> {
		delete this.profiles[profileId].wallets[address];

		return this.saveProfiles();
	}

	ensureWalletDelegateProperties(
		wallet: Wallet,
		delegateOrUserName: string | Delegate,
	): Observable<boolean> {
		if (!wallet) {
			return throwError("WALLET_EMPTY");
		}

		const userName: string =
			!delegateOrUserName || typeof delegateOrUserName === "string"
				? (delegateOrUserName as string)
				: delegateOrUserName.username;

		if (!userName) {
			return throwError("USERNAME_EMPTY");
		}

		if (wallet.isDelegate && wallet.username === userName) {
			return EMPTY;
		}

		wallet.isDelegate = true;
		wallet.username = userName;
		return this.updateWallet(wallet, this.currentProfile.profileId, true);
	}

	getWalletByAddress(
		address: string,
		profileId: string = this.authProvider.loggedProfileId,
	): Wallet {
		if (!address || lodash.isUndefined(profileId)) {
			return;
		}

		const profile = this.getProfileById(profileId);
		let wallet = new Wallet();

		if (profile.wallets[address]) {
			wallet = wallet.deserialize(profile.wallets[address]);
			wallet.loadTransactions(wallet.transactions);
			return wallet;
		}

		return null;
	}

	// Save only if wallet exists in profile
	updateWallet(
		wallet: Wallet,
		profileId: string,
		notificate: boolean = false,
	): Observable<any> {
		if (lodash.isUndefined(profileId)) {
			return throwError("EMPTY_PROFILE_ID");
		}

		const profile = this.getProfileById(profileId);
		if (profile && profile.wallets[wallet.address]) {
			return this.saveWallet(wallet, profileId, notificate);
		}

		return EMPTY;
	}

	saveWallet(
		wallet: Wallet,
		profileId: string = this.authProvider.loggedProfileId,
		notificate: boolean = false,
	) {
		if (lodash.isUndefined(profileId)) {
			return throwError("EMPTY_PROFILE_ID");
		}

		const profile = this.getProfileById(profileId);
		wallet.lastUpdate = new Date().getTime();
		profile.wallets[wallet.address] = wallet;

		this.profiles[profileId] = profile;

		if (notificate) {
			this.onUpdateWallet$.next(wallet);
		}

		return this.saveProfiles();
	}

	public setWalletLabel(
		wallet: Wallet,
		label: string,
	): Observable<never | any> {
		if (!wallet) {
			return throwError({
				key: "VALIDATION.INVALID_WALLET",
			} as TranslatableObject);
		}

		if (
			lodash.some(
				this.currentProfile.wallets,
				(w) =>
					label &&
					w.label &&
					w.label.toLowerCase() === label.toLowerCase(),
			)
		) {
			return throwError({
				key: "VALIDATION.LABEL_EXISTS",
				parameters: { label },
			} as TranslatableObject);
		}

		wallet.label = label;
		return this.updateWallet(wallet, this.currentProfile.profileId);
	}

	public getWalletLabel(
		walletOrAddress: Wallet | string,
		profileId?: string,
	): string {
		let wallet: Wallet;
		if (typeof walletOrAddress === "string") {
			wallet = this.getWalletByAddress(walletOrAddress, profileId);
		} else {
			wallet = walletOrAddress;
		}

		if (!wallet) {
			return null;
		}

		return wallet.username || wallet.label;
	}

	setCurrentWallet(wallet: Wallet) {
		this.currentWallet = wallet;
	}

	clearCurrentWallet() {
		this.currentWallet = undefined;
	}

	loadProfiles() {
		return this.storageProvider.getObject(constants.STORAGE_PROFILES).pipe(
			map((profiles) => {
				// we have to create "real" contacts here, because the "address" property was not on the contact object
				// in the first versions of the app
				return lodash.mapValues(profiles, (profile, profileId) => ({
					...profile,
					profileId,
					contacts: lodash.transform(
						profile.contacts,
						UserDataServiceImpl.mapContact,
						{},
					),
				}));
			}),
		);
	}

	loadNetworks(): Observable<Record<string, StoredNetwork>> {
		return new Observable((observer) => {
			// Return defaults networks from arkts
			this.storageProvider
				.getObject(constants.STORAGE_NETWORKS)
				.subscribe((networks) => {
					if (!networks || lodash.isEmpty(networks)) {
						const uniqueDefaults = {};

						for (const network of this.defaultNetworks) {
							uniqueDefaults[this.generateUniqueId()] = network;
						}

						this.storageProvider.set(
							constants.STORAGE_NETWORKS,
							uniqueDefaults,
						);
						observer.next(uniqueDefaults);
					} else {
						observer.next(networks);
					}

					observer.complete();
				});
		});
	}

	getKeysByWallet(wallet: Wallet, password: string): WalletKeys {
		if (!wallet.cipherKey && !wallet.cipherSecondKey) {
			return;
		}

		const keys: WalletKeys = {};

		if (wallet.cipherKey) {
			keys.key = this.forgeProvider.decrypt(
				wallet.cipherKey,
				password,
				wallet.address,
				wallet.iv,
			);
		}

		if (wallet.cipherSecondKey) {
			keys.secondKey = this.forgeProvider.decrypt(
				wallet.cipherSecondKey,
				password,
				wallet.address,
				wallet.iv,
			);
		}

		return keys;
	}

	private setCurrentNetwork(): void {
		if (!this.currentProfile) {
			return;
		}

		const network = new StoredNetwork();

		Object.assign(network, this.networks[this.currentProfile.networkId]);
		this.onActivateNetwork$.next(network);

		this.currentNetwork = network;
	}

	private setCurrentProfile(
		profileId: string,
		broadcast: boolean = true,
	): void {
		if (profileId && this.profiles[profileId]) {
			const profile = new Profile().deserialize(this.profiles[profileId]);
			this.currentProfile = profile;
			if (broadcast) {
				this.onSelectProfile$.next(profile);
			}
		} else {
			this.currentProfile = null;
			this.authProvider.logout(false);
		}
	}

	private loadAllData() {
		this.loadProfiles().subscribe((profiles) => (this.profiles = profiles));
		this.loadNetworks().subscribe((networks) => (this.networks = networks));
	}

	private onLogin() {
		return this.authProvider.onLogin$.subscribe((id) => {
			this.setCurrentProfile(id);
			this.setCurrentNetwork();
		});
	}

	private onClearStorage() {
		this.storageProvider.onClear$.pipe(debounceTime(100)).subscribe(() => {
			this.loadAllData();
			this.setCurrentProfile(null);
		});
	}

	private generateUniqueId(): string {
		return uuid();
	}
}
