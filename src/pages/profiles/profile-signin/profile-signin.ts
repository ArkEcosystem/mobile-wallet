import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private translateService: TranslateService,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) { }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  showDeleteConfirm(profileId: string) {
    this.translateService.get(['ARE_YOU_SURE', 'CONFIRM', 'CANCEL']).takeUntil(this._unsubscriber).subscribe((translation) => {
      let confirm = this.alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
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
    return this.userDataProvider.removeProfileById(profileId).takeUntil(this._unsubscriber).subscribe((result) => {
      this.load();
    });
  }

  isMainnet(profileId: string) {
    let profile = this.userDataProvider.getProfileById(profileId);

    if (profile) {
      let network = this.userDataProvider.getNetworkById(profile.networkId);

      if (!network) return;

      return network.type === NetworkType.Mainnet;
    }
  }

  getNetworkName(profileId: string) {
    let profile = this.userDataProvider.getProfileById(profileId);
    if (profile && profile.networkId) {
      let network = this.userDataProvider.getNetworkById(profile.networkId)
      return network.name;
    }
  }

  signin(profileId: string) {
    let modal = this.modalCtrl.create('PinCodePage', {
      validatePassword: true
    });

    modal.onDidDismiss((status) => {
      if (status) {
        this.authProvider.login(profileId).takeUntil(this._unsubscriber).subscribe((status) => {
          if (status) {
            this.navCtrl.setRoot('WalletListPage');
          } else {
            // TODO: Show toast error
          }
        });
      }
    });

    modal.present();
  }

  load() {
    this.profiles = this.userDataProvider.profiles;
    this.profilesIds = lodash.keys(this.profiles);

    this.networks = this.userDataProvider.networks;
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
