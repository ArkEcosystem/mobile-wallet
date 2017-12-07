import { AutoCompleteService } from 'ionic2-auto-complete';
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map'
import lodash from 'lodash';

import { UserDataProvider } from '@providers/user-data/user-data';

@Injectable()
export class ContactsAutoCompleteService implements AutoCompleteService {
  labelAttribute = "name";
  formValueAttribute = "address"

  constructor(private userDataProvider: UserDataProvider) { }

  getResults(keyword: string) {
    keyword = keyword.toLowerCase();

    let contacts = lodash.map(this.userDataProvider.currentProfile.contacts, (value, key) => {
      if (value['name']) {
        return { address: key.toString(), name: 'Contact: ' + value['name'].toString() };
      }
    });
    let wallets = lodash.map(this.userDataProvider.currentProfile.wallets, (value, key) => {
      let address = value['address'];
      let label = value['label'] || value['address'];
      if (address && label) {
        return { address: address.toString(), name: label.toString() };
      }
    });
    console.log(contacts, wallets);

    let results = contacts.concat(wallets).sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0;
    }).filter((result) => {
      return result.address && ((result.address.toLowerCase().indexOf(keyword) > -1) || (result.name && (result.name.toLowerCase().indexOf(keyword) > -1)));
    });

    return results;
  }
}
