import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-wallet-empty',
  templateUrl: 'wallet-empty.html',
})
export class WalletEmptyPage {

  private _unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private _platform: Platform,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _actionSheetCtrl: ActionSheetController,
    private _translateService: TranslateService,
  ) { }

  presentActionSheet() {
    this._translateService.get([
      'Generate',
      'Import',
      'Cancel',
    ]).takeUntil(this._unsubscriber).subscribe((translation) => {
      let actionSheet = this._actionSheetCtrl.create({
        buttons: [
          {
            text: translation['Generate'],
            role: 'generate',
            icon: !this._platform.is('ios') ? 'card' : null,
            handler: () => {
              this.openWalletGenerate();
            }
          }, {
            text: translation['Import'],
            role: 'import',
            icon: !this._platform.is('ios') ? 'sync' : null,
            handler: () => {
              this.openWalletImport();
            }
          }, {
            text: translation['Cancel'],
            icon: !this._platform.is('ios') ? 'close' : null,
            role: 'cancel'
          }
        ]
      });

      actionSheet.present();
    });
  }

  openWalletGenerate() {
    this._navCtrl.push('WalletGenerateEntropyPage');
  }

  openWalletImport() {
    this._navCtrl.push('WalletImportPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletEmptyPage');
  }

  ngOnDestroy() {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

}
