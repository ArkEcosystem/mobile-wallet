import { Pipe, PipeTransform } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';

@Pipe({
  name: 'accountLabel',
})
export class AccountLabelPipe implements PipeTransform {

  constructor(private userDataProvider: UserDataProvider, private contactsProvider: ContactsProvider) {
  }

  transform(value: string, defaultText: string, ...args) {
    const contact = this.contactsProvider.getContactByAddress(value);
    if (contact) { return contact.name; }

    const label = this.userDataProvider.getWalletLabel(value);
    if (label) { return label; }

    if (defaultText) { return defaultText; }

    return value;
  }
}
