import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ModalController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Wallet } from '@models/wallet';
import { UserDataProvider } from '@providers/user-data/user-data';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-wallet-empty',
  templateUrl: 'wallet-empty.html',
})
export class WalletEmptyPage {

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
  ) { }

  presentActionSheet() {
    this.translateService.get([
      'GENERATE',
      'IMPORT',
      'CANCEL',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation.GENERATE,
            role: 'generate',
            icon: !this.platform.is('ios') ? 'card' : null,
            handler: () => {
              this.openWalletGenerate();
            }
          }, {
            text: translation.IMPORT,
            role: 'import',
            icon: !this.platform.is('ios') ? 'sync' : null,
            handler: () => {
              this.openWalletImport();
            }
          }, {
            text: translation.CANCEL,
            icon: !this.platform.is('ios') ? 'close' : null,
            role: 'cancel'
          }
        ]
      });

      actionSheet.present();
    });
  }

  openWalletGenerate() {
    let modal = this.modalCtrl.create('GenerateEntropyPage');

    modal.onDidDismiss((entropy) => {
      if (!entropy) return;

      let showModal = this.modalCtrl.create('WalletCreatePage', {
        entropy,
      });

      showModal.onDidDismiss((account) => {
        if (!account) return;

        this.storeWallet(account);
      });


      showModal.present();
    })

    modal.present();
  }

  openWalletImport() {
    this.navCtrl.push('WalletImportPage');
  }

  private storeWallet(account) {
    let wallet = new Wallet();
    wallet.address = account.address;
    wallet.publicKey = account.publicKey;

    let modal = this.modalCtrl.create('PinCodePage', {
      message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
      outputPassword: true,
      validatePassword: true
    });

    modal.onDidDismiss((password) => {
      if (!password) return;

      this.userDataProvider.addWallet(wallet, account.mnemonic, password).takeUntil(this.unsubscriber$).subscribe((response) => {
        this.navCtrl.setRoot('ProfileSigninPage');
      });
    })

    modal.present();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
