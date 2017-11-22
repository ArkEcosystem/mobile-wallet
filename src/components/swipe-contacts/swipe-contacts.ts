import { Component, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { UserDataProvider } from '@providers/user-data/user-data';

import { Contact } from '@models/contact';
import lodash from 'lodash';

@Component({
  selector: 'swipe-contacts',
  templateUrl: 'swipe-contacts.html'
})
export class SwipeContactsComponent {

  @Output() onSelectContact = new EventEmitter();

  contacts: any;
  selectedAddress: string;

  constructor(
    private navCtrl: NavController,
    private userDataProvider: UserDataProvider,
  ) {
    this.contacts = lodash.map(this.userDataProvider.currentProfile.contacts, (value, key) => {
      return { address: key, name: value['name'] };
    });
  }

  add() {
    this.selectedAddress = 'add';
    this.onSelectContact.emit();
  }

  select(contact: any) {
    this.selectedAddress = contact.address;
    this.onSelectContact.emit(this.selectedAddress);
  }

}
