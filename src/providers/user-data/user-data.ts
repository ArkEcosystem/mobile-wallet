import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';
import { AuthProvider } from '@providers/auth/auth';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ForgeProvider } from '@providers/forge/forge';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';

import { Contact, Profile, Wallet } from '@models/model';

import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import { Network } from 'ark-ts/model';

import * as constants from '@app/app.constants';

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
    if (lodash.isNil(this.profiles)) return;

    let contacts = this.profiles[profileId].contacts || {};
    contacts[address] = contact;

    this.profiles[profileId]['contacts'] = contacts;

    return this.saveProfiles();
  }

  editContact(address: string, contact: Contact) {
    if (lodash.isNil(this.profiles)) return;

    lodash.forEach(this.profiles, (item, id) => {
      if (item['contacts'][address]) {
        this.profiles[id]['contacts'][address] = contact;
      }
    });

    return this.saveProfiles();
  }

  getContactByAddress(address: string): Contact {
    if (lodash.isNil(this.profiles)) return;

    let contacts = lodash.map(this.profiles, (p) => p['contacts']);
    let merged = Object.assign({}, ...contacts);

    if (lodash.isNil(merged)) return;

    return <Contact>merged[address];
  }

  removeContactByAddress(address: string) {
    if (lodash.isNil(this.profiles)) return;

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
    profile.salt = this.forgeProvider.generateSalt();
    profile.iv = this.forgeProvider.generateIv();

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
    let currentProfile = this.authProvider.loggedProfileId;

    if (currentProfile) this.setCurrentProfile(currentProfile, false);
    return this.storageProvider.set(constants.STORAGE_PROFILES, profiles);
  }

  encryptSecondPassphrase(wallet: Wallet, pinCode: string, secondPassphrase: string, profileId: string = this.authProvider.loggedProfileId) {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.getProfileById(profileId);
    if (wallet && !wallet.cipherSecondPassphrase) {
      wallet.cipherSecondPassphrase = this.forgeProvider.encrypt(secondPassphrase, pinCode, profile.salt, profile.iv);
      return this.saveWallet(wallet, profileId, true);
    }

    return this.saveProfiles();
  }

  addWallet(wallet: Wallet, passphrase: string, pinCode: string, profileId: string = this.authProvider.loggedProfileId) {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.getProfileById(profileId);
    let cipherPassphrase = this.forgeProvider.encrypt(passphrase, pinCode, profile.salt, profile.iv);
    wallet.cipherPassphrase = cipherPassphrase;

    if (!profile.wallets[wallet.address]) {
      this.onCreateWallet$.next(wallet);
      return this.saveWallet(wallet, profileId);
    }

    return this.saveProfiles();
  }

  getWalletByAddress(address: string, profileId: string = this.authProvider.loggedProfileId): Wallet {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.getProfileById(profileId);
    let wallet = new Wallet();

    if (profile.wallets[address]) {
      wallet = wallet.deserialize(profile.wallets[address]);
      return wallet;
    }

    return null;
  }

  saveWallet(wallet: Wallet, profileId: string = this.authProvider.loggedProfileId, notificate: boolean = false) {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.getProfileById(profileId);
    wallet.lastUpdate = new Date().getTime();
    profile.wallets[wallet.address] = wallet;

    this.profiles[profileId] = profile;

    if (notificate) this.onUpdateWallet$.next(wallet);

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

          for (var i = 0; i < defaults.length; i++) {
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

  getPassphrasesByWallet(wallet: Wallet, password: string) {
    if (!wallet.cipherPassphrase && !wallet.cipherSecondPassphrase) return;

    let passphrases = {
      passphrase: undefined,
      secondPassphrase: undefined
    };

    if (wallet.cipherPassphrase) {
      passphrases.passphrase = this.forgeProvider.decrypt(wallet.cipherPassphrase, password, this.currentProfile.salt, this.currentProfile.iv);
    }

    if (wallet.cipherSecondPassphrase) {
      passphrases.secondPassphrase = this.forgeProvider.decrypt(wallet.cipherSecondPassphrase, password, this.currentProfile.salt, this.currentProfile.iv);
    }

    return passphrases;
  }

  private setCurrentNetwork(): void {
    if (!this.currentProfile) return;

    let network = new Network();

    Object.assign(network, this.networks[this.currentProfile.networkId]);
    this.onActivateNetwork$.next(network);

    this.currentNetwork = network;
  }

  private setCurrentProfile(profileId: string, broadcast: boolean = true): void {
    if (profileId && this.profiles[profileId]) {
      let profile = new Profile().deserialize(this.profiles[profileId]);
      this.currentProfile = profile;
      if (broadcast) this.onSelectProfile$.next(profile);
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
