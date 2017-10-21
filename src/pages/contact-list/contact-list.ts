import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';

import { TranslateService } from '@ngx-translate/core';

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
  ) {
    this._load();
  }

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

  delete(address) {
    this._userDataProvider.removeContact(address);
    this._load();
  }

  openEditPage(address) {
    return this._navCtrl.push('ContactCreatePage', { address });
  }

  openCreatePage() {
    return this._navCtrl.push('ContactCreatePage');
  }

  private _load() {
    this.profile = this._userDataProvider.profileActive;
    this.network = this._userDataProvider.networkActive;

    this.contacts = this.profile.contacts;
    this.addresses = Object.keys(this.contacts);
  }
}
