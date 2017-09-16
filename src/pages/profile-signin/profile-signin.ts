import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: UserDataProvider,
    public translateService: TranslateService,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
  ) { }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  showDeleteConfirm(profileId: string) {
    this.translateService.get(['Are you sure?', 'Confirm', 'Cancel']).subscribe((translation) => {
      let confirm = this.alertCtrl.create({
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
    return this.localDataProvider.profileRemove(profileId).subscribe((result) => {
      this.load();
    });
  }

  isMainnet(profileId: string) {
    if (this.profiles[profileId]) {
      return this.networks[this.profiles[profileId].networkId].type === NetworkType.Mainnet;
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
    this.authProvider.masterPasswordHasSet().subscribe((hasSeetMasterPassword) => {
      if (hasSeetMasterPassword) {
        // this.getPinCode();
      } else {
        this.authProvider.login(profileId).subscribe((status) => {
          if (status) {
            var wallets = this.localDataProvider.profileActive.wallets;
            var addresses = lodash.keys(wallets) || [];

            if (addresses.length === 0) {
              this.navCtrl.setRoot('WalletEmptyPage');
            } else {
              this.navCtrl.setRoot('WalletDashboardPage', {
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
    this.profiles = this.localDataProvider.profiles;
    this.profilesIds = lodash.keys(this.profiles);

    this.networks = this.localDataProvider.networks;
  }

  isEmpty() {
    return lodash.isEmpty(this.profiles);
  }

  ionViewDidLoad() {
    this.load();
  }

}
