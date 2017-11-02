import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  public profile;
  public network;
  public contacts = [];
  public addresses = [];

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private _translateService: TranslateService,
    private _alertCtrl: AlertController,
  ) { }

  openSendPage(address) {
    this._navCtrl.push('TransactionSendPage', { address });
  }

  showDeleteConfirm(address) {
    this._translateService.get([
      'CANCEL',
      'CONFIRM',
      'ARE_YOU_SURE',
    ]).subscribe((translation) => {
      let alert = this._alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this.delete(address);
            }
          }
        ]
      });

      alert.present();
    })
  }

  isEmpty() {
    return lodash.isEmpty(this.contacts);
  }

  delete(address) {
    this._userDataProvider.removeContactByAddress(address);
    this._load();
  }

  openEditPage(address) {
    let contact = this.contacts[address];
    return this._navCtrl.push('ContactCreatePage', { address, contact });
  }

  openCreatePage() {
    return this._navCtrl.push('ContactCreatePage');
  }

  private _load() {
    this.profile = this._userDataProvider.currentProfile;
    this.network = this._userDataProvider.currentNetwork;

    this.contacts = this.profile.contacts;
    this.addresses = Object.keys(this.contacts);
  }

  ionViewDidLoad() {
    this._load();
  }
}
