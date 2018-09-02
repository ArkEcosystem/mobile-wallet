import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserDataProvider } from '@providers/user-data/user-data';
import { AuthProvider } from '@providers/auth/auth';
import { ToastProvider } from '@providers/toast/toast';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';
import { NetworkType } from 'ark-ts/model';
import { PublicKey } from 'ark-ts/core';
import { AddressMap } from '@models/model';
import { Platform } from 'ionic-angular/platform/platform';
import { PinCodeComponent } from '@components/pin-code/pin-code';

@IonicPage()
@Component({
  selector: 'page-profile-signin',
  templateUrl: 'profile-signin.html',
})
export class ProfileSigninPage implements OnDestroy {
  @ViewChild('pinCode') pinCode: PinCodeComponent;

  public profiles;
  public addresses: AddressMap[];
  public networks;

  private profileIdSelected: string;
  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private translateService: TranslateService,
    private authProvider: AuthProvider,
    private toastProvider: ToastProvider,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  presentProfileActionSheet(profileId: string) {
    this.translateService.get(['EDIT', 'DELETE']).takeUntil(this.unsubscriber$).subscribe((translation) => {
      const buttons = [{
        text: translation.DELETE,
        role: 'delete',
        icon: this.platform.is('ios') ? 'ios-trash-outline' : 'md-trash',
        handler: () => {
          if (!this.profileHasWallets(profileId)) {
            this.showDeleteConfirm(profileId);
          } else {
            this.toastProvider.error('PROFILES_PAGE.DELETE_NOT_EMPTY');
          }
        },
      }];

      const action = this.actionSheetCtrl.create({buttons});
      action.present();
    });
  }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  showDeleteConfirm(profileId: string) {
    this.translateService.get(['ARE_YOU_SURE', 'CONFIRM', 'CANCEL']).takeUntil(this.unsubscriber$).subscribe((translation) => {
      const confirm = this.alertCtrl.create({
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
    return this.userDataProvider.removeProfileById(profileId).takeUntil(this.unsubscriber$).subscribe(() => {
      this.load();
    });
  }

  verify(profileId: string) {
    this.profileIdSelected = profileId;
    this.pinCode.open('PIN_CODE.DEFAULT_MESSAGE', false);
  }

  signin() {
    if (!this.profileIdSelected) { return; }

    this.authProvider.login(this.profileIdSelected).takeUntil(this.unsubscriber$).subscribe((status) => {
      if (status) {
        this.navCtrl.setRoot('WalletListPage');
      } else {
        this.error();
      }
    });
  }

  error() {
    this.toastProvider.error('PIN_CODE.SIGN_IN_ERROR');
  }

  load() {
    this.profiles = this.userDataProvider.profiles;
    this.networks = this.userDataProvider.networks;

    this.addresses = lodash(this.profiles).mapValues((o) => [o.name, o.networkId]).transform((result, data, id) => {
      const network = this.networks[data[1]];
      if (!network) {
        return;
      }
      const networkName = lodash.capitalize(network.name);
      const isMainnet = network.type === NetworkType.Mainnet;

      result.push({ index: id, key: data[0], value: networkName, highlight: isMainnet });
    }, []).value();

  }

  isEmpty() {
    return lodash.isEmpty(this.profiles);
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  private profileHasWallets(profileId: string): boolean {
    const profile = this.profiles[profileId];
    const network = this.networks[profile.networkId];
    for (const wallet of lodash.values(profile.wallets)) {
      if (PublicKey.validateAddress(wallet.address, network)) {
        return true;
      }
    }

    return false;
  }

}
