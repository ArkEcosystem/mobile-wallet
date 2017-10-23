import { Pipe, PipeTransform } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';

import lodash from 'lodash';

@Pipe({
  name: 'accountLabel',
})
export class AccountLabelPipe implements PipeTransform {

  constructor(public userDataProvider: UserDataProvider) {

  }

  transform(value: string, defaultText: string, ...args) {
    let contact = this.userDataProvider.getContact(value);
    if (contact) return contact.name;

    let wallet = this.userDataProvider.walletGet(value);

    if (wallet) {
      let label = wallet.username || wallet.label || wallet.address;
      return label;
    }

    if (defaultText) return defaultText;

    return value;
  }
}
