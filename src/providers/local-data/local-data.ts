import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Contact, Profile } from '@models/model';

import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import { Network } from 'ark-ts/model';

@Injectable()
export class LocalDataProvider {

  private STORAGE_PROFILES = 'profiles';
  private STORAGE_CONTACTS = 'contacts';
  private STORAGE_NETWORKS = 'networks';
  
  public profiles = {};
  public networks = {};
  public contacts = {};

  constructor(public storage: StorageProvider) {
    this.profilesLoad().subscribe((profiles) => this.profiles = profiles);
    this.networksLoad().subscribe((networks) => this.networks = networks);
    this.contactsLoad().subscribe((contacts) => this.contacts = contacts);
  }

  contactAdd(contact: Contact) {
    this.contacts[this.generateUniqueId()] = contact;

    return this.storage.set(this.STORAGE_CONTACTS, this.contacts);
  }

  contactGet(contactId: string) {
    return this.contacts[contactId];
  }

  contactRemove(contactId: string) {
    delete this.contacts[contactId];

    return this.storage.set(this.STORAGE_CONTACTS, this.contacts);
  }

  contactsLoad() {
    return this.storage.getObject(this.STORAGE_CONTACTS);
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

  profileAdd(profile: Profile) {
    this.profiles[this.generateUniqueId()] = profile;

    return this.storage.set(this.STORAGE_PROFILES, this.profiles);
  }

  profileGet(profileId: string) {
    return this.profiles[profileId];
  }

  profileRemove(profileId: string) {
    delete this.profiles[profileId];

    return this.storage.set(this.STORAGE_PROFILES, this.profiles);
  }

  profilesLoad() {
    return this.storage.getObject(this.STORAGE_PROFILES);
  }

  private generateUniqueId(): string {
    return uuid();
  }

}
