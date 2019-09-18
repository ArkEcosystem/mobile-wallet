import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, AlertController, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { TranslateService } from '@ngx-translate/core';

import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { PinCodeComponent } from '@components/pin-code/pin-code';

import * as constants from '@app/app.constants';

const packageJson = require('@root/package.json');

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [InAppBrowser],
})
export class SettingsPage implements OnInit, OnDestroy {
  @ViewChild('pinCode') pinCode: PinCodeComponent;

  public objectKeys = Object.keys;

  public availableOptions;
  public currentSettings;
  public onEnterPinCode;
  public appVersion: number = packageJson.version;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public platform: Platform,
    private navCtrl: NavController,
    private settingsDataProvider: SettingsDataProvider,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private inAppBrowser: InAppBrowser
  ) {
    this.availableOptions = this.settingsDataProvider.AVALIABLE_OPTIONS;
  }

  openChangePinPage() {
    const modal = this.modalCtrl.create('PinCodeModal', {
      message: 'PIN_CODE.DEFAULT_MESSAGE',
      outputPassword: true,
      validatePassword: true,
    });

    modal.present();
    modal.onDidDismiss((password) => {
      if (password) {
        this.pinCode.createUpdatePinCode(null, password);
      }
    });
  }

  openManageNetworksPage() {
    const modal = this.modalCtrl.create('CustomNetworkManageModal');
    modal.present();
  }

  openPrivacyPolicy() {
    return this.inAppBrowser.create(constants.PRIVACY_POLICY_URL, '_system');
  }

  confirmClearData() {
    this.translateService.get([
      'CANCEL',
      'CONFIRM',
      'ARE_YOU_SURE',
      'SETTINGS_PAGE.CLEAR_DATA_TEXT',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      const confirm = this.alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        message: translation['SETTINGS_PAGE.CLEAR_DATA_TEXT'],
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this.onEnterPinCode = this.clearData;
              this.pinCode.open('PIN_CODE.DEFAULT_MESSAGE', false);
            }
          }
        ]
      });

      confirm.present();
    });
  }

  private clearData() {
    this.settingsDataProvider.clearData();
    this.navCtrl.setRoot('IntroPage');
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
