import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { TranslateService } from '@ngx-translate/core';

import { UserSettings } from '@models/settings';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
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

  private _unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _settingsDataProvider: SettingsDataProvider,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
  ) {
    this.availableOptions = this._settingsDataProvider.AVALIABLE_OPTIONS;
  }

  openChangePinPage() {
    // TODO:
  }

  openWalletBackupPage() {
    // TODO:
  }

  confirmClearData() {
    this._translateService.get([
      'CANCEL',
      'CONFIRM',
      'ARE_YOU_SURE',
      'CLEAR_DATA_TEXT',
    ]).takeUntil(this._unsubscriber$).subscribe((translation) => {
      let confirm = this._alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        message: translation.CLEAR_DATA_TEXT,
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this._clearData();
            }
          }
        ]
      });

      confirm.present();
    });
  }

  private _clearData() {
    this._settingsDataProvider.clearData();
    this._navCtrl.setRoot('LoginPage');
  }

  onUpdate() {
    this._settingsDataProvider.save(this.currentSettings);
  }

  ionViewDidLoad() {
    this._settingsDataProvider.settings
      .takeUntil(this._unsubscriber$)
      .do((settings) => this.currentSettings = settings)
      .subscribe();
  }

  ngOnInit() {
    this._settingsDataProvider.onUpdate$
      .takeUntil(this._unsubscriber$)
      .do((settings) => this.currentSettings = settings)
      .subscribe();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
