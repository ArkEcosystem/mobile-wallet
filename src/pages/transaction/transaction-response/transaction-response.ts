import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Content, ViewController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';

import { UserDataProvider } from '@providers/user-data/user-data';
import { TranslateService } from '@ngx-translate/core';

import { Transaction, Wallet, WalletKeys } from '@models/model';
import { TransactionType } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-transaction-response',
  templateUrl: 'transaction-response.html',
  providers: [Clipboard],
})
export class TransactionResponsePage {
  @ViewChild(Content) content: Content;

  public transaction: Transaction;
  public wallet: Wallet;
  public keys: WalletKeys = {};
  public response: any = { status: false, message: '' };

  public showKeepSecondPassphrase: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private viewController: ViewController,
  ) {
    this.wallet = this.navParams.get('wallet');
    this.response = this.navParams.get('response');
    this.keys = this.navParams.get('keys');

    let transaction = this.navParams.get('transaction');

    if (!this.response) this.navCtrl.pop();

    if (transaction) this.transaction = new Transaction(this.wallet.address).deserialize(transaction);

    this.verifySecondPassphrasHasEncrypted();
  }

  copyTxid() {
    this.clipboard.copy(this.transaction.id);
  }

  presentEncryptedAlert() {
    this.translateService.get([
      'WALLETS_PAGE.SECOND_PASSPHRASE',
      'WALLETS_PAGE.ALERT_SUCCESSFULLY_ENCRYPTED_SECOND_PASSPHRASE'
    ]).subscribe((translation) => {
      let alert = this.alertCtrl.create({
        title: translation['WALLETS_PAGE.SECOND_PASSPHRASE'],
        subTitle: translation['WALLETS_PAGE.ALERT_SUCCESSFULLY_ENCRYPTED_SECOND_PASSPHRASE'],
        buttons: ['Ok'],
        enableBackdropDismiss: true,
      });

      alert.present();
    })
  }

  saveSecondPassphrase() {
    let modal = this.modalCtrl.create('PinCodeModal', {
      message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
      outputPassword: true,
      validatePassword: true,
    });

    modal.onDidDismiss((password) => {
      if (!password) return;

      this.userDataProvider.encryptSecondPassphrase(this.wallet, password, this.keys.secondKey).subscribe((data) => {
        this.wallet = this.userDataProvider.getWalletByAddress(this.wallet.address);

        this.showKeepSecondPassphrase = false;
        if (this.content) this.content.resize();
        this.presentEncryptedAlert();
      });
    })

    modal.present();
  }

  verifySecondPassphrasHasEncrypted() {
    if (!this.transaction) return;

    if (this.transaction.type === TransactionType.SecondSignature || (this.wallet.secondSignature && !this.wallet.cipherWif)) {
      if (this.response.status) return this.showKeepSecondPassphrase = true;
    }

    this.showKeepSecondPassphrase = false;
    if (this.content) this.content.resize();
  }

  dismiss() {
    this.viewController.dismiss();
  }

}
