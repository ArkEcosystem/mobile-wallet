import { Injectable } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';
import { NetworkProvider } from '@providers/network/network';
import lodash from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Contact } from '@models/contact';
import { Profile } from '@models/profile';
import { TranslatableObject } from '@models/model';

@Injectable()
export class ContactsProvider {

  public constructor(private userDataProvider: UserDataProvider, private networkProvider: NetworkProvider) {
  }

  public addContact(address: string, name: string): Observable<any> {
    if (!this.networkProvider.isValidAddress(address)) {
      return Observable.throw({key: 'CONTACTS_PAGE.INVALID_ADDRESS', parameters: {address}} as TranslatableObject);
    }

    if (!name) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_NAME_EMPTY'} as TranslatableObject);
    }

    if (this.getContactByAddress(address)) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_EXISTS_ADDRESS', parameters: {address}} as TranslatableObject);
    }

    if (this.getContactByName(name)) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_EXISTS_NAME', parameters: {name}} as TranslatableObject);
    }

    const profile = this.getProfile();
    const contacts = profile.contacts || {};

    contacts[address] = {address, name} as Contact;
    profile.contacts = contacts;

    return this.userDataProvider.saveProfiles();
  }

  public editContact(address: string, name: string): Observable<any> {
    const contact = this.getContactByAddress(address);
    if (!contact) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_NOT_EXISTS_ADDRESS', parameters: {address}} as TranslatableObject);
    }

    if (!name) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_NAME_EMPTY'} as TranslatableObject);
    }

    const existingContact = this.getContactByName(name);
    if (existingContact && existingContact.address !== address) {
      return Observable.throw({key: 'CONTACTS_PAGE.CONTACT_EXISTS_NAME', parameters: {name}} as TranslatableObject);
    }

    contact.name = name;
    const profile = this.getProfile();
    profile.contacts[address] = contact;
    return this.userDataProvider.saveProfiles();
  }

  public removeContactByAddress(address: string): Observable<any> {
    const profile = this.getProfile();

    profile.contacts = lodash.omit(profile.contacts, [address]);

    return this.userDataProvider.saveProfiles();
  }

  public getContactByAddress(address: string, profileId?: string): Contact {
    const profile = this.getProfile(profileId);

    if (!address || lodash.isNil(profile.contacts)) {
      return null;
    }

    return profile.contacts[address];
  }

  public getContactByName(name: string): Contact {
    const profile = this.getProfile();

    if (!name || lodash.isNil(profile.contacts)) {
      return null;
    }

    return lodash.chain(profile.contacts).filter(c => c.name.toLowerCase() === name.toLowerCase()).first().value();
  }

  private getProfile(profileId?: string): Profile {
    if (profileId) {
      return this.userDataProvider.getProfileById(profileId);
    }

    const profile: Profile = this.userDataProvider.getCurrentProfile();
    if (!profile) {
      throw new Error('This service can only be used if a current profile is set!');
    }
    return profile;
  }
}
