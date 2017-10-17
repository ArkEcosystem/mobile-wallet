import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserDataProvider } from '@providers/user-data/user-data';
import { AuthProvider } from '@providers/auth/auth';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';
import { NetworkType } from 'ark-ts/model';

@IonicPage()
@Component({
  selector: 'page-profile-signin',
  templateUrl: 'profile-signin.html',
})
export class ProfileSigninPage {

  public profiles;
  public profilesIds;

  public networks;

  private _unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private _translateService: TranslateService,
    private _authProvider: AuthProvider,
    private _alertCtrl: AlertController,
  ) { }

  openProfileCreate() {
    this._navCtrl.push('ProfileCreatePage');
  }

  showDeleteConfirm(profileId: string) {
    this._translateService.get(['Are you sure?', 'Confirm', 'Cancel']).takeUntil(this._unsubscriber).subscribe((translation) => {
      let confirm = this._alertCtrl.create({
        title: translation['Are you sure?'],
        buttons: [
          {
            text: translation['Cancel']
          },
          {
            text: translation['Confirm'],
            handler: () => {
              this.delete(profileId);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  delete(profileId: string) {
    return this._userDataProvider.profileRemove(profileId).takeUntil(this._unsubscriber).subscribe((result) => {
      this.load();
    });
  }

  isMainnet(profileId: string) {
    let profile = this._userDataProvider.profileGet(profileId);

    if (profile) {
      let network = this._userDataProvider.networkGet(profile.networkId);

      if (!network) return;

      return network.type === NetworkType.Mainnet;
    }
  }

  getNetworkName(profileId: string) {
    if (this.profiles[profileId]) {
      return this.networks[this.profiles[profileId].networkId].name;
    }
  }

  // getPinCode(): Promise<string> {
  //   // TODO: Get pin code from component
  // }

  signin(profileId: string) {
    this._authProvider.getMasterPassword().takeUntil(this._unsubscriber).subscribe((masterpassword) => {
      if (masterpassword) {
        // this.getPinCode();
      } else {
        this._authProvider.login(profileId).takeUntil(this._unsubscriber).subscribe((status) => {
          if (status) {
            var wallets = this._userDataProvider.profileActive.wallets;
            var addresses = lodash.keys(wallets) || [];

            if (addresses.length === 0) {
              this._navCtrl.setRoot('WalletEmptyPage');
            } else {
              this._navCtrl.setRoot('WalletDashboardPage', {
                address: wallets[addresses[0]].address,
              });
            }
          } else {
            // TODO: Show toast error
          }
        });
      }
    });
  }

  load() {
    this.profiles = this._userDataProvider.profiles;
    this.profilesIds = lodash.keys(this.profiles);

    this.networks = this._userDataProvider.networks;
  }

  isEmpty() {
    return lodash.isEmpty(this.profiles);
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

}
