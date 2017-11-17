import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { TranslateService } from '@ngx-translate/core';

import { UserSettings, Wallet } from '@models/model';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { UserDataProvider } from '@providers/user-data/user-data';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public objectKeys = Object.keys;

  public availableOptions;
  public currentSettings;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private currentWallet: Wallet;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private settingsDataProvider: SettingsDataProvider,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
  ) {
    this.availableOptions = this.settingsDataProvider.AVALIABLE_OPTIONS;
    this.currentWallet = this.userDataProvider.currentWallet;
  }

  openChangePinPage() {
    // TODO:
  }

  openWalletBackupPage() {
    if (!this.currentWallet) return this.presentSelectWallet();

    this.getPassphrases().then((passphrases) => {
      if (!passphrases) return;

      let modal = this.modalCtrl.create('WalletBackupPage', {
        title: 'SETTINGS_PAGE.WALLET_BACKUP',
        passphrases,
      });

      modal.present();
    });
  }

  confirmClearData() {
    this.translateService.get([
      'CANCEL',
      'CONFIRM',
      'ARE_YOU_SURE',
      'SETTINGS_PAGE.CLEAR_DATA_TEXT',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      let confirm = this.alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        message: translation['SETTINGS_PAGE.CLEAR_DATA_TEXT'],
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this.clearData();
            }
          }
        ]
      });

      confirm.present();
    });
  }

  private presentSelectWallet() {
    this.translateService.get([
      'SETTINGS_PAGE.SELECT_WALLET',
      'SETTINGS_PAGE.SELECT_WALLET_FIRST_TEXT'
    ]).subscribe((translation) => {
      let alert = this.alertCtrl.create({
        title: translation['SETTINGS_PAGE.SELECT_WALLET'],
        message: translation['SETTINGS_PAGE.SELECT_WALLET_FIRST_TEXT'],
        buttons: [{
          text: 'Ok'
        }]
      })

      alert.present();
    });
  }

  private clearData() {
    this.getPassphrases().then(() => {
      this.settingsDataProvider.clearData();
      this.navCtrl.setRoot('LoginPage');
    });
  }

  private getPassphrases() {
    let message = 'PIN_CODE.DEFAULT_MESSAGE';
    let modal = this.modalCtrl.create('PinCodePage', {
      message,
      outputPassword: true,
      validatePassword: true,
    });

    modal.present();

    return new Promise((resolve, reject) => {
      modal.onDidDismiss((password) => {
        if (!password) {
          reject();
        } else {
          if (this.currentWallet) {
            let passphrases = this.userDataProvider.getPassphrasesByWallet(this.currentWallet, password);
            resolve(passphrases);
          }

          resolve();
        }
      });
    });
  }

  onUpdate() {
    this.settingsDataProvider.save(this.currentSettings);
  }

  ionViewDidLoad() {
    this.settingsDataProvider.settings
      .takeUntil(this.unsubscriber$)
      .do((settings) => this.currentSettings = settings)
      .subscribe();
  }

  ngOnInit() {
    this.settingsDataProvider.onUpdate$
      .takeUntil(this.unsubscriber$)
      .do((settings) => this.currentSettings = settings)
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
