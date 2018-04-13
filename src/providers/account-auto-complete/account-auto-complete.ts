import { AutoCompleteService } from 'ionic2-auto-complete';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import lodash from 'lodash';

import { UserDataProvider } from '@providers/user-data/user-data';
import { PublicKey } from 'ark-ts/core';
import { AutoCompleteAccount, AutoCompleteAccountType, Contact } from '@models/contact';
import { Wallet } from '@models/wallet';

@Injectable()
export class AccountAutoCompleteService implements AutoCompleteService {

  // even though this fields are unused, they are required by the AutoCompleteService!
  public labelAttribute = 'address';
  public formValueAttribute = 'address';

  public constructor(private userDataProvider: UserDataProvider) {
  }

  getResults(keyword: string): AutoCompleteAccount[] {
    keyword = keyword.toLowerCase();

    const contacts: AutoCompleteAccount[] = lodash.map(this.userDataProvider.currentProfile.contacts, (contact: Contact) => {
      return {
        address: contact.address,
        name: contact.name,
        iconName: 'ios-contacts-outline',
        type: AutoCompleteAccountType.Contact
      } as AutoCompleteAccount;
    });

    const wallets: AutoCompleteAccount[] = lodash.map(this.userDataProvider.currentProfile.wallets, (wallet: Wallet) => {
      const address = wallet.address;
      const label = this.userDataProvider.getWalletLabel(wallet) || wallet.address;
      if (address) {
        return {
          address: address,
          name: label,
          iconName: 'ios-cash-outline',
          type: AutoCompleteAccountType.Wallet
        } as AutoCompleteAccount;
      }
    });

    return contacts.sort(AccountAutoCompleteService.sortContacts)
                   .concat(wallets.sort(AccountAutoCompleteService.sortContacts))
                   .filter(c => this.isValidContact(c, keyword));
  }

  private static sortContacts(a: AutoCompleteAccount, b: AutoCompleteAccount): number {
    if (a.name !== a.address && b.name === b.address) {
      return -1;
    }

    if (a.name === a.address && b.name !== b.address) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  }

  private isValidContact(contact: AutoCompleteAccount, keyword: string): boolean {
    return PublicKey.validateAddress(contact.address, this.userDataProvider.currentNetwork)
           && (contact.address.toLowerCase().indexOf(keyword) > -1
               || (contact.name && contact.name.toLowerCase().indexOf(keyword) > -1));
  }
}
