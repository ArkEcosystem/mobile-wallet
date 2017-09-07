import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-wallet-empty',
  templateUrl: 'wallet-empty.html',
})
export class WalletEmptyPage {

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public translateService: TranslateService,
  ) { }

  presentActionSheet() {
    this.translateService.get([
      'Generate new wallet',
      'Import wallet',
      'Cancel',
    ]).subscribe((translation) => {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation['Generate new wallet'],
            role: 'generate',
            icon: !this.platform.is('ios') ? 'card' : null,
            handler: () => {
              this.openWalletGenerate();
            }
          }, {
            text: translation['Import wallet'],
            role: 'import',
            icon: !this.platform.is('ios') ? 'sync' : null,
            handler: () => {
              this.openWalletImport();
            }
          }, {
            text: translation['Cancel'],
            icon: !this.platform.is('ios') ? 'close' : null,
            role: 'cancel'
          }
        ]
      });

      actionSheet.present();
    });
  }

  openWalletGenerate() {
    this.navCtrl.push('WalletGeneratePage');
  }

  openWalletImport() {
    this.navCtrl.push('WalletImportPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletEmptyPage');
  }

}
