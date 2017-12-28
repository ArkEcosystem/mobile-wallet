import { Pipe, PipeTransform } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';

@Pipe({
  name: 'accountLabel',
})
export class AccountLabelPipe implements PipeTransform {

  constructor(public userDataProvider: UserDataProvider) {

  }

  transform(value: string, defaultText: string, ...args) {
    let contact = this.userDataProvider.getContactByAddress(value);
    if (contact) return contact.name;

    let wallet = this.userDataProvider.getWalletByAddress(value);
    if (wallet) {
      let label = wallet.username || wallet.label;
      if (label) return label;
    }

    if (defaultText) return defaultText;

    return value;
  }
}
