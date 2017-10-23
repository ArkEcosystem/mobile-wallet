import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';
import { AuthProvider } from '@providers/auth/auth';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

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

  public profileActive: Profile;
  public networkActive: Network;

  public onActivateNetwork$: Subject<Network> = new Subject();
  public onCreateWallet$: Subject<Wallet> = new Subject();
  public onUpdateWallet$: Subject<Wallet> = new Subject();
  public onSelectProfile$: Subject<Profile> = new Subject();

  constructor(
    private _storageProvider: StorageProvider,
    private _authProvider: AuthProvider
  ) {
    this._loadAllData();

    this._onLogin();
    this._onClearStorage();
  }

  addContact(address: string, contact: Contact, profileId: string = this._authProvider.loggedProfileId) {
    if (!this.profiles[profileId]) return;

    let contacts = this.profiles[profileId].contacts || {};
    contacts[address] = contact;

    this.profiles[profileId]['contacts'] = contacts;

    return this.profilesSave();
  }

  editContact(address: string, contact: Contact) {
    if (lodash.isNil(this.profiles)) return;

    lodash.forEach(this.profiles, (item, id) => {
      if (item['contacts'][address]) {
        this.profiles[id]['contacts'][address] = contact;
      }
    });

    return this.profilesSave();
  }

  getContact(address: string): Contact {
    if (lodash.isNil(this.profiles)) return;
    let contacts = lodash.flatMap(this.profiles, (item) => item['contacts']);

    if (lodash.isNil(contacts)) return;

    return <Contact>contacts[address];
  }

  removeContact(address: string) {
    if (lodash.isNil(this.profiles)) return;

    lodash.forEach(this.profiles, (item, id) => {
      this.profiles[id]['contacts'] = lodash.omit(item['contacts'], [address]);
    });

    return this.profilesSave();
  }

  networkAdd(network: Network) {
    this.networks[this._generateUniqueId()] = network;

    return this._storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
  }

  networkUpdate(networkId: string, network: Network) {
    this.networks[networkId] = network;

    return this._storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
  }

  networkGet(networkId: string) {
    return this.networks[networkId];
  }

  networkRemove(networkId: string) {
    delete this.networks[networkId];

    this._storageProvider.set(constants.STORAGE_NETWORKS, this.networks);
    return this.networks;
  }

  profileAdd(profile: Profile) {
    this.profiles[this._generateUniqueId()] = profile;

    return this.profilesSave();
  }

  profileGet(profileId: string) {
    return new Profile().deserialize(this.profiles[profileId]);
  }

  profileRemove(profileId: string) {
    delete this.profiles[profileId];

    return this.profilesSave();
  }

  profilesSave(profiles = this.profiles) {
    let currentProfile = this._authProvider.loggedProfileId;

    if (currentProfile) this._setProfileActive(currentProfile, false);
    return this._storageProvider.set(constants.STORAGE_PROFILES, profiles);
  }

  walletAdd(wallet: Wallet, profileId: string = this._authProvider.loggedProfileId) {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.profileGet(profileId);

    if (!profile.wallets[wallet.address]) {
      this.onCreateWallet$.next(wallet);
      return this.walletSave(wallet, profileId);
    }

    return this.profilesSave();
  }

  walletGet(address: string, profileId: string = this._authProvider.loggedProfileId): Wallet {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.profileGet(profileId);
    let wallet = new Wallet();

    if (profile.wallets[address]) {
      wallet = wallet.deserialize(profile.wallets[address]);
      return wallet;
    }

    return null;
  }

  walletSave(wallet: Wallet, profileId: string = this._authProvider.loggedProfileId, notificate: boolean = false) {
    if (lodash.isUndefined(profileId)) return;

    let profile = this.profileGet(profileId);
    profile.wallets[wallet.address] = wallet;

    this.profiles[profileId] = profile;

    if (notificate) this.onUpdateWallet$.next(wallet);

    return this.profilesSave();
  }

  public loadProfiles() {
    return this._storageProvider.getObject(constants.STORAGE_PROFILES);
  }

  public loadNetworks() {
    const defaults = Network.getAll();

    return Observable.create((observer) => {
      // Return defaults networks from arkts
      this._storageProvider.getObject(constants.STORAGE_NETWORKS).subscribe((networks) => {
        if (!networks || lodash.isEmpty(networks)) {
          const uniqueDefaults = {};

          for (var i = 0; i < defaults.length; i++) {
            uniqueDefaults[this._generateUniqueId()] = defaults[i];
          }

          this._storageProvider.set(constants.STORAGE_NETWORKS, uniqueDefaults);
          observer.next(uniqueDefaults);
        } else {
          observer.next(networks);
        }

        observer.complete();
      });
    });
  }

  private _setNetworkActive(): void {
    if (!this.profileActive) return;

    let network = new Network();

    Object.assign(network, this.networks[this.profileActive.networkId]);
    this.onActivateNetwork$.next(network);

    this.networkActive = network;
  }

  private _setProfileActive(profileId: string, broadcast: boolean = true): void {
    if (profileId && this.profiles[profileId]) {
      let profile = new Profile().deserialize(this.profiles[profileId]);
      this.profileActive = profile;
      if (broadcast) this.onSelectProfile$.next(profile);
    }
  }

  private _loadAllData() {
    this.loadProfiles().subscribe((data) => this.profiles = data);
    this.loadNetworks().subscribe((data) => this.networks = data);
  }

  private _onLogin() {
    return this._authProvider.onLogin$.subscribe((id) => {
      this._setProfileActive(id);
      this._setNetworkActive();
    });
  }

  private _onClearStorage() {
    this._storageProvider.onClear$
      .debounceTime(100)
      .do(() => {
        this._loadAllData();
        this._setProfileActive(null);
      })
      .subscribe();
  }

  private _generateUniqueId(): string {
    return uuid();
  }

}
