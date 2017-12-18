import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ActionSheetController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserDataProvider } from '@providers/user-data/user-data';
import { AuthProvider } from '@providers/auth/auth';
import { ToastProvider } from '@providers/toast/toast';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';
import { NetworkType } from 'ark-ts/model';
import { AddressMap } from '@models/model';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage()
@Component({
  selector: 'page-profile-signin',
  templateUrl: 'profile-signin.html',
})
export class ProfileSigninPage {

  public profiles;
  public addresses: AddressMap[];
  public networks;

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
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  presentProfileActionSheet(profileId: string) {
    this.translateService.get(['EDIT', 'DELETE']).takeUntil(this.unsubscriber$).subscribe((translation) => {
      let buttons = [{
        text: translation.DELETE,
        role: 'delete',
        icon: !this.platform.is('ios') ? 'ios-trash-outline' : '',
        handler: () => {
          this.showDeleteConfirm(profileId);
        },
      }];

      let action = this.actionSheetCtrl.create({buttons});
      action.present();
    });
  }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  showDeleteConfirm(profileId: string) {
    this.translateService.get(['ARE_YOU_SURE', 'CONFIRM', 'CANCEL']).takeUntil(this.unsubscriber$).subscribe((translation) => {
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
    return this.userDataProvider.removeProfileById(profileId).takeUntil(this.unsubscriber$).subscribe((result) => {
      this.load();
    });
  }

  signin(profileId: string) {
    let modal = this.modalCtrl.create('PinCodeModal', {
      validatePassword: true
    });

    modal.onDidDismiss((status) => {
      if (status) {
        this.authProvider.login(profileId).takeUntil(this.unsubscriber$).subscribe((status) => {
          if (status) {
            this.navCtrl.setRoot('WalletListPage');
          } else {
            this.toastProvider.error('PIN_CODE.LOGIN_ERROR');
          }
        });
      }
    });

    modal.present();
  }

  load() {
    this.profiles = this.userDataProvider.profiles;
    this.networks = this.userDataProvider.networks;

    this.addresses = lodash(this.profiles).mapValues((o) => [o.name, o.networkId]).transform((result, data, id) => {
      let network = this.networks[data[1]];
      let networkName = lodash.capitalize(network.name);
      let isMainnet = network.type === NetworkType.Mainnet;

      result.push({ index: id, key: data[0], value: networkName, highlight: isMainnet });
    }, []).value();

    console.log(this.addresses);
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

}
