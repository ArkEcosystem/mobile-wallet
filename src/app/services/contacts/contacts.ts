import { Injectable } from "@angular/core";
import lodash from "lodash";
import { Observable, throwError } from "rxjs";

import { Contact } from "@/models/contact";
import { TranslatableObject } from "@/models/model";
import { Profile } from "@/models/profile";
import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Injectable({ providedIn: "root" })
export class ContactsProvider {
	public constructor(
		private userDataService: UserDataService,
		private networkProvider: NetworkProvider,
	) {}

	public addContact(address: string, name: string): Observable<any> {
		if (!this.networkProvider.isValidAddress(address)) {
			return throwError({
				key: "CONTACTS_PAGE.INVALID_ADDRESS",
				parameters: { address },
			} as TranslatableObject);
		}

		if (!name) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_NAME_EMPTY",
			} as TranslatableObject);
		}

		if (this.getContactByAddress(address)) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_EXISTS_ADDRESS",
				parameters: { address },
			} as TranslatableObject);
		}

		if (this.getContactByName(name)) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_EXISTS_NAME",
				parameters: { name },
			} as TranslatableObject);
		}

		const profile = this.getProfile();
		const contacts = profile.contacts || {};

		contacts[address] = { address, name } as Contact;
		profile.contacts = contacts;

		return this.userDataService.saveProfiles();
	}

	public editContact(address: string, name: string): Observable<any> {
		if (!name) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_NAME_EMPTY",
			} as TranslatableObject);
		}

		if (!address) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_ADDRESS_EMPTY",
			} as TranslatableObject);
		}

		const contactByName = this.getContactByName(name);
		if (contactByName && contactByName.address !== address) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_EXISTS_NAME",
				parameters: { name },
			} as TranslatableObject);
		}
		const contact = this.getContactByAddress(address);

		if (!contact) {
			return throwError({
				key: "CONTACTS_PAGE.CONTACT_NOT_EXISTS_ADDRESS",
				parameters: { address },
			} as TranslatableObject);
		}

		contact.name = name;
		const profile = this.getProfile();
		profile.contacts[address] = contact;
		return this.userDataService.saveProfiles();
	}

	public removeContactByAddress(address: string): Observable<any> {
		const profile = this.getProfile();

		profile.contacts = lodash.omit(profile.contacts, [address]);

		return this.userDataService.saveProfiles();
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

		return lodash
			.chain(profile.contacts)
			.filter((c) => c.name.toLowerCase() === name.toLowerCase())
			.first()
			.value();
	}

	private getProfile(profileId?: string): Profile {
		if (profileId) {
			return this.userDataService.getProfileById(profileId);
		}

		const profile: Profile = this.userDataService.currentProfile;
		if (!profile) {
			throw new Error(
				"This service can only be used if a current profile is set!",
			);
		}
		return profile;
	}
}
