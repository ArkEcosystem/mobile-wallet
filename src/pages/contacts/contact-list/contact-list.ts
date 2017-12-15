import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

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

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private platform: Platform,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private _translateService: TranslateService,
    private _alertCtrl: AlertController,
    private _actionSheetCtrl: ActionSheetController,
  ) { }

  presentContactActionSheet(address) {
    this._translateService.get([
      'CONTACTS_PAGE.EDIT_CONTACT',
      'CONTACTS_PAGE.DELETE_CONTACT',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      let buttons = [
        {
          text: translation['CONTACTS_PAGE.EDIT_CONTACT'],
          role: 'label',
          icon: !this.platform.is('ios') ? 'md-create' : '',
          handler: () => {
            this.openEditPage(address);
          },
        }, {
          text: translation['CONTACTS_PAGE.DELETE_CONTACT'],
          role: 'label',
          icon: !this.platform.is('ios') ? 'md-trash' : '',
          handler: () => {
            this.showDeleteConfirm(address);
          },
        }
      ];

      let action = this._actionSheetCtrl.create({buttons});
      action.present();
    });
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
