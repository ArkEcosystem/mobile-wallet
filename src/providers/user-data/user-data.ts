import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';
import { AuthProvider } from '@providers/auth/auth';
import { ForgeProvider } from '@providers/forge/forge';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Contact, Profile, Wallet, WalletKeys } from '@models/model';

import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import { Network } from 'ark-ts/model';

import * as constants from '@app/app.constants';
import { NetworkType } from 'ark-ts';

@Injectable()
export class UserDataProvider {

  public profiles = {};
  public networks = {};

  public currentProfile: Profile;
  public currentNetwork: Network;
  public currentWallet: Wallet;

  public onActivateNetwork$: Subject<Network> = new Subject();
  public onCreateWallet$: Subject<Wallet> = new Subject();
  public onUpdateWallet$: Subject<Wallet> = new Subject();
  public onSelectProfile$: Subject<Profile> = new Subject();

  public get isDevNet(): boolean {
    return this.currentNetwork && this.currentNetwork.type === NetworkType.Devnet;
  }

  constructor(
    private storageProvider: StorageProvider,
    private authProvider: AuthProvider,
    private forgeProvider: ForgeProvider,
  ) {
    this.loadAllData();

    this.onLogin();
    this.onClearStorage();
  }

  addContact(address: string, contact: Contact, profileId: string = this.authProvider.loggedProfileId) {
    if (lodash.isNil(this.profiles)) { return; }

    const contacts = this.profiles[profileId].contacts || {};
    contacts[address] = contact;

    this.profiles[profileId]['contacts'] = contacts;

    return this.saveProfiles();
  }

  editContact(address: string, contact: Contact) {
    if (lodash.isNil(this.profiles)) { return; }

    lodash.forEach(this.profiles, (item, id) => {
      if (item['contacts'][address]) {
        this.profiles[id]['contacts'][address] = contact;
      }
    });

    return this.saveProfiles();
  }

  getContactByAddress(address: string): Contact {
    if (lodash.isNil(this.profiles) || !address) { return; }

    const contacts = lodash.map(this.profiles, (p) => p['contacts']);
    const merged = Object.assign({}, ...contacts);

    if (lodash.isNil(merged)) { return; }

    return <Contact>merged[address];
  }

  removeContactByAddress(address: string) {
    if (lodash.isNil(this.profiles)) { return; }

    lodash.forEach(this.profiles, (item, id) => {
      this.profiles[id]['contacts'] = lodash.omit(item['contacts'], [address]);
    });

    return this.saveProfiles();
  }

  addNetwork(network: Network) {
    this.networks[this.generateUniqueId()] = network;

    return this.storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
  }

  updateNetwork(networkId: string, network: Network) {
    this.networks[networkId] = network;

    return this.storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
  }

  getNetworkById(networkId: string) {
    return this.networks[networkId];
  }

  removeNetworkById(networkId: string) {
    delete this.networks[networkId];

    this.storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
    return this.networks;
  }

  addProfile(profile: Profile) {
    this.profiles[this.generateUniqueId()] = profile;

    return this.saveProfiles();
  }

  getProfileById(profileId: string) {
    return new Profile().deserialize(this.profiles[profileId]);
  }

  removeProfileById(profileId: string) {
    delete this.profiles[profileId];

    return this.saveProfiles();
  }

  saveProfiles(profiles = this.profiles) {
    const currentProfile = this.authProvider.loggedProfileId;

    if (currentProfile) { this.setCurrentProfile(currentProfile, false); }
    return this.storageProvider.set(constants.STORAGE_PROFILES, profiles);
  }

  encryptSecondPassphrase(wallet: Wallet,
                          pinCode: string,
                          secondPassphrase: string,
                          profileId: string = this.authProvider.loggedProfileId) {
    if (lodash.isUndefined(profileId)) { return; }

    if (wallet && !wallet.cipherSecondKey) {
      // wallet.secondBip38 = this.forgeProvider.encryptBip38(secondWif, pinCode, this.currentNetwork);
      wallet.cipherSecondKey = this.forgeProvider.encrypt(secondPassphrase, pinCode, wallet.address, wallet.iv);
      return this.saveWallet(wallet, profileId, true);
    }

    return this.saveProfiles();
  }

  addWallet(wallet: Wallet, passphrase: string, pinCode: string, profileId: string = this.authProvider.loggedProfileId) {
    if (lodash.isUndefined(profileId)) { return; }

    const profile = this.getProfileById(profileId);

    const iv = this.forgeProvider.generateIv();

    if (passphrase) {
      wallet.iv = iv;
      const cipherKey = this.forgeProvider.encrypt(passphrase, pinCode, wallet.address, iv);
      // wallet.bip38 = this.forgeProvider.encryptBip38(wif, pinCode, this.currentNetwork);
      wallet.cipherKey = cipherKey;
    }

    if (!profile.wallets[wallet.address] || profile.wallets[wallet.address].isWatchOnly) {
      this.onCreateWallet$.next(wallet);
      return this.saveWallet(wallet, profileId);
    }

    return this.saveProfiles();
  }

  updateWalletEncryption(oldPassword: string, newPassword: string) {
    for (const profileId in this.profiles) {
      const profile = this.profiles[profileId];
      for (const walletId in profile.wallets) {
        const wallet = profile.wallets[walletId];
        if (wallet.isWatchOnly) {
          continue;
        }
        const key = this.forgeProvider.decrypt(wallet.cipherKey, oldPassword, wallet.address, wallet.iv);
        wallet.cipherKey = this.forgeProvider.encrypt(key, newPassword, wallet.address, wallet.iv);
        // wallet.bip38 = this.forgeProvider.encryptBip38(wif, newPassword, this.currentNetwork);

        if (wallet.cipherSecondKey) {
          const secondKey = this.forgeProvider.decrypt(wallet.cipherSecondKey, oldPassword, wallet.address, wallet.iv);
          wallet.cipherSecondKey = this.forgeProvider.encrypt(secondKey, newPassword, wallet.address, wallet.iv);
          // wallet.secondBip38 = this.forgeProvider.encryptBip38(secondWif, newPassword, this.currentNetwork);
        }

        this.saveWallet(wallet, profileId);
      }
    }

    return this.saveProfiles();
  }

  removeWalletByAddress(address: string, profileId: string = this.authProvider.loggedProfileId): void {
    delete this.profiles[profileId]['wallets'][address];

    this.saveProfiles();
  }

  getWalletByAddress(address: string, profileId: string = this.authProvider.loggedProfileId): Wallet {
    if (lodash.isUndefined(profileId)) { return; }

    const profile = this.getProfileById(profileId);
    let wallet = new Wallet();

    if (profile.wallets[address]) {
      wallet = wallet.deserialize(profile.wallets[address]);
      wallet.loadTransactions(wallet.transactions);
      return wallet;
    }

    return null;
  }

  saveWallet(wallet: Wallet, profileId: string = this.authProvider.loggedProfileId, notificate: boolean = false) {
    if (lodash.isUndefined(profileId)) { return; }

    const profile = this.getProfileById(profileId);
    wallet.lastUpdate = new Date().getTime();
    profile.wallets[wallet.address] = wallet;

    this.profiles[profileId] = profile;

    if (notificate) { this.onUpdateWallet$.next(wallet); }

    return this.saveProfiles();
  }

  setCurrentWallet(wallet: Wallet) {
    this.currentWallet = wallet;
  }

  clearCurrentWallet() {
    this.currentWallet = undefined;
  }

  loadProfiles() {
    return this.storageProvider.getObject(constants.STORAGE_PROFILES);
  }

  loadNetworks() {
    const defaults = Network.getAll();

    return Observable.create((observer) => {
      // Return defaults networks from arkts
      this.storageProvider.getObject(constants.STORAGE_NETWORKS).subscribe((networks) => {
        if (!networks || lodash.isEmpty(networks)) {
          const uniqueDefaults = {};

          for (let i = 0; i < defaults.length; i++) {
            uniqueDefaults[this.generateUniqueId()] = defaults[i];
          }

          this.storageProvider.set(constants.STORAGE_NETWORKS, uniqueDefaults);
          observer.next(uniqueDefaults);
        } else {
          observer.next(networks);
        }

        observer.complete();
      });
    });
  }

  getKeysByWallet(wallet: Wallet, password: string): WalletKeys {
    if (!wallet.cipherKey && !wallet.cipherSecondKey) { return; }

    const keys: WalletKeys = {};

    if (wallet.cipherKey) {
      keys.key = this.forgeProvider.decrypt(wallet.cipherKey, password, wallet.address, wallet.iv);
    }

    if (wallet.cipherSecondKey) {
      keys.secondKey = this.forgeProvider.decrypt(wallet.cipherSecondKey, password, wallet.address, wallet.iv);
    }

    return keys;
  }

  private setCurrentNetwork(): void {
    if (!this.currentProfile) { return; }

    const network = new Network();

    Object.assign(network, this.networks[this.currentProfile.networkId]);
    this.onActivateNetwork$.next(network);

    this.currentNetwork = network;
  }

  private setCurrentProfile(profileId: string, broadcast: boolean = true): void {
    if (profileId && this.profiles[profileId]) {
      const profile = new Profile().deserialize(this.profiles[profileId]);
      this.currentProfile = profile;
      if (broadcast) { this.onSelectProfile$.next(profile); }
    } else {
      this.currentProfile = null;
      this.authProvider.logout(false);
    }
  }

  private loadAllData() {
    this.loadProfiles().subscribe((data) => this.profiles = data);
    this.loadNetworks().subscribe((data) => this.networks = data);
  }

  private onLogin() {
    return this.authProvider.onLogin$.subscribe((id) => {
      this.setCurrentProfile(id);
      this.setCurrentNetwork();
    });
  }

  private onClearStorage() {
    this.storageProvider.onClear$
      .debounceTime(100)
      .do(() => {
        this.loadAllData();

        this.setCurrentProfile(null);
      })
      .subscribe();
  }

  private generateUniqueId(): string {
    return uuid();
  }

}
