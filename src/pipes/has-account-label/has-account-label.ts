import { Pipe, PipeTransform } from '@angular/core';
import { AccountLabelPipe } from '@pipes/account-label/account-label';
import { ContactsProvider } from '@providers/contacts/contacts';
import { UserDataProvider } from '@providers/user-data/user-data';

@Pipe({
  name: 'hasAccountLabel',
})
export class HasAccountLabelPipe implements PipeTransform {

  private accountLabelPipe: AccountLabelPipe;

  constructor(userDataProvider: UserDataProvider, contactsProvider: ContactsProvider) {
    this.accountLabelPipe = new AccountLabelPipe(userDataProvider, contactsProvider);
  }

  public transform(address: string): boolean {
    return this.accountLabelPipe.transform(address, null) !== address;
  }
}
