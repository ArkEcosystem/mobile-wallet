import { AutoCompleteService } from 'ionic2-auto-complete';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import lodash from 'lodash';

import { UserDataProvider } from '@providers/user-data/user-data';
import { PublicKey } from 'ark-ts/core';
import { AutoCompleteContact } from '@models/contact';

@Injectable()
export class ContactsAutoCompleteService implements AutoCompleteService {

  // even though this fields are unused, they are required by the AutoCompleteService!
  public labelAttribute = 'name';
  public formValueAttribute = 'address';

  public constructor(private userDataProvider: UserDataProvider) {
  }

  getResults(keyword: string): AutoCompleteContact[] {
    keyword = keyword.toLowerCase();

    const contacts: AutoCompleteContact[] = lodash.map(this.userDataProvider.currentProfile.contacts, (value, key) => {
      if (value['name']) {
        return {
          address: key.toString(),
          name: value['name'].toString(),
          iconName: 'ios-contacts-outline'
        } as AutoCompleteContact;
      }
    });

    const wallets: AutoCompleteContact[] = lodash.map(this.userDataProvider.currentProfile.wallets, (value) => {
      const address = value['address'];
      const label = value['label'] || value['address'];
      if (address) {
        return {
          address: address.toString(),
          name: label.toString(),
          iconName: 'ios-cash-outline'
        } as AutoCompleteContact;
      }
    });

    return contacts.sort(ContactsAutoCompleteService.sortContacts)
                   .concat(wallets.sort(ContactsAutoCompleteService.sortContacts))
                   .filter(c => this.isValidContact(c, keyword));
  }

  private static sortContacts(a: AutoCompleteContact, b: AutoCompleteContact): number {
    if (a.name !== a.address && b.name === b.address) {
      return -1;
    }

    if (a.name === a.address && b.name !== b.address) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  }

  private isValidContact(contact: AutoCompleteContact, keyword: string): boolean {
    return PublicKey.validateAddress(contact.address, this.userDataProvider.currentNetwork)
           && (contact.address.toLowerCase().indexOf(keyword) > -1
               || (contact.name && contact.name.toLowerCase().indexOf(keyword) > -1));
  }
}
