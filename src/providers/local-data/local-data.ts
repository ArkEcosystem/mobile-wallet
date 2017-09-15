import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';
import { AuthProvider } from '@providers/auth/auth';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { Contact, Profile, Wallet } from '@models/model';

import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import { Network } from 'ark-ts/model';

@Injectable()
export class LocalDataProvider {

  private STORAGE_PROFILES = 'profiles';
  private STORAGE_NETWORKS = 'networks';

  public profiles = {};
  public networks = {};

  public profileActive: Profile;
  public profileActiveObserver: BehaviorSubject<Profile> = new BehaviorSubject(null);

  public networkActive: Network;
  public networkActiveObserver: BehaviorSubject<Network> = new BehaviorSubject(null);

  constructor(public storage: StorageProvider, public authProvider: AuthProvider) {
    this.profilesLoad().subscribe((profiles) => this.profiles = profiles);
    this.networksLoad().subscribe((networks) => this.networks = networks);

    this.authProvider.activeProfileObserver.subscribe((id) => {
      if (lodash.isEmpty(id)) {
        this.profileActiveObserver.next(null);
        this.networkActiveObserver.next(null);
      } else {
        this._setProfileActive();
        this._setNetworkActive();
      }
    });
  }

  contactAdd(profileId: string, contact: Contact) {
    this.profiles[profileId].contacts[this.generateUniqueId()] = contact;

    return this.profilesSave();
  }

  contactGet(profileId: string, contactId: string) {
    return this.profiles[profileId].contacts[contactId];
  }

  contactRemove(profileId: string, contactId: string) {
    delete this.profiles[profileId].contacts[contactId];

    return this.profilesSave();
  }

  private _setNetworkActive(): void {
    if (!this.profileActive) return;

    let network = new Network();

    Object.assign(network, this.networks[this.profileActive.networkId]);
    this.networkActiveObserver.next(network);

    this.networkActive = network;
  }

  networkAdd(network: Network) {
    this.networks[this.generateUniqueId()] = network;

    return this.storage.set(this.STORAGE_NETWORKS, this.networks);
  }

  networkGet(networkId: string) {
    return this.networks[networkId];
  }

  networkRemove(networkId: string) {
    delete this.networks[networkId];

    return this.networks;
  }

  networksLoad() {
    const defaults = Network.getAll();

    return Observable.create((observer) => {
      this.storage.getObject(this.STORAGE_NETWORKS).subscribe((networks) => {
        if (!networks || lodash.isEmpty(networks)) {
          const uniqueDefaults = {};

          for (var i = 0; i < defaults.length; i++) {
            uniqueDefaults[this.generateUniqueId()] = defaults[i];
          }

          this.storage.set(this.STORAGE_NETWORKS, uniqueDefaults);
          observer.next(uniqueDefaults);
        } else {
          observer.next(networks);
        }

        observer.complete();
      });
    });
  }

  private _setProfileActive(): void {
    let activeId = this.authProvider.activeProfileId;

    if (activeId && this.profiles[activeId]) {
      let profile = new Profile().deserialize(this.profiles[activeId]);
      this.profileActive = profile;
      this.profileActiveObserver.next(profile);
    }
  }

  profileAdd(profile: Profile) {
    this.profiles[this.generateUniqueId()] = profile;

    return this.profilesSave();
  }

  profileGet(profileId: string) {
    return new Profile().deserialize(this.profiles[profileId]);
  }

  profileRemove(profileId: string) {
    delete this.profiles[profileId];

    return this.profilesSave();
  }

  profilesLoad() {
    return this.storage.getObject(this.STORAGE_PROFILES);
  }

  profilesSave(profiles = this.profiles) {
    return this.storage.set(this.STORAGE_PROFILES, profiles);
  }

  walletAdd(wallet: Wallet, profileId?: string) {
    if (!profileId) profileId = this.authProvider.activeProfileId;

    let profile = this.profileGet(profileId);

    if (!profile.wallets[wallet.address]) {
      return this.walletSave(wallet, profileId);
    }

    return this.profilesSave();
  }

  walletGet(address: string, profileId?: string): Wallet {
    if (!profileId) profileId = this.authProvider.activeProfileId;

    let profile = this.profileGet(profileId);
    let wallet = new Wallet();

    if (profile.wallets[address]) {
      wallet = wallet.deserialize(profile.wallets[address]);
      return wallet;
    }

    return null;
  }

  walletSave(wallet: Wallet, profileId?: string) {
    if (!profileId) profileId = this.authProvider.activeProfileId;

    let profile = this.profileGet(profileId);
    profile.wallets[wallet.address] = wallet;

    this.profiles[profileId] = profile;

    return this.profilesSave();
  }

  private generateUniqueId(): string {
    return uuid();
  }

}
