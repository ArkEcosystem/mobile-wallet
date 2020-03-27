import { Injectable } from "@angular/core";
import { Delegate, Network } from "ark-ts/model";
import { Observable, Subject } from "rxjs";

import { Profile, StoredNetwork, Wallet, WalletKeys } from "@/models/model";

@Injectable()
export abstract class UserDataService {
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

	public abstract get isDevNet(): boolean;
	public abstract get isMainNet(): boolean;
	public abstract get defaultNetworks(): Network[];

	public abstract addOrUpdateNetwork(
		network: StoredNetwork,
		networkId?: string,
	): Observable<{
		network: Network;
		id: string;
	}>;
	public abstract getNetworkById(networkId: string): StoredNetwork;
	public abstract removeNetworkById(networkId: string): Observable<boolean>;
	public abstract addProfile(profile: Profile): Observable<boolean>;
	public abstract getProfileByName(name: string): Profile;
	public abstract getProfileById(profileId: string): Profile;
	public abstract removeProfileById(profileId: string): Observable<boolean>;
	public abstract saveProfiles(profiles?: { [key: string]: any }): any;
	public abstract encryptSecondPassphrase(
		wallet: Wallet,
		pinCode: string,
		secondPassphrase: string,
		profileId?: string,
	): any;
	public abstract addWallet(
		wallet: Wallet,
		passphrase: string,
		pinCode: string,
		profileId?: string,
	): any;
	public abstract updateWalletEncryption(
		oldPassword: string,
		newPassword: string,
	): any;
	public abstract removeWalletByAddress(
		address: string,
		profileId?: string,
	): Observable<boolean>;
	public abstract ensureWalletDelegateProperties(
		wallet: Wallet,
		delegateOrUserName: string | Delegate,
	): Observable<boolean>;
	public abstract getWalletByAddress(
		address: string,
		profileId?: string,
	): Wallet;
	public abstract updateWallet(
		wallet: Wallet,
		profileId: string,
		notificate?: boolean,
	): Observable<any>;
	public abstract saveWallet(
		wallet: Wallet,
		profileId?: string,
		notificate?: boolean,
	): any;
	public abstract setWalletLabel(
		wallet: Wallet,
		label: string,
	): Observable<never | any>;
	public abstract getWalletLabel(
		walletOrAddress: Wallet | string,
		profileId?: string,
	): string;
	public abstract setCurrentWallet(wallet: Wallet): void;
	public abstract clearCurrentWallet(): void;
	public abstract loadProfiles(): Observable<Record<string, Profile>>;
	public abstract loadNetworks(): Observable<Record<string, StoredNetwork>>;
	public abstract getKeysByWallet(
		wallet: Wallet,
		password: string,
	): WalletKeys;
}
