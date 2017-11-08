import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';

import { UserDataProvider } from '@providers/user-data/user-data';

import { Transaction, Wallet } from '@models/model';
import { TransactionType } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-transaction-response',
  templateUrl: 'transaction-response.html',
  providers: [Clipboard],
})
export class TransactionResponsePage {

  public transaction: Transaction;
  public wallet: Wallet;
  public passphrases: any = { passphrase: undefined, secondPassphrase: undefined };
  public response: any = { status: false, message: '', transaction: undefined };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
  ) {
    this.wallet = this.navParams.get('wallet');
    this.response = this.navParams.get('response');
    this.passphrases = this.navParams.get('passphrases');
    this.transaction = this.response.transaction;

    if (!this.response || !this.wallet) this.navCtrl.pop();
  }

  copyTxid() {
    this.clipboard.copy(this.transaction.id);
  }

  saveSecondPassphrase() {
    let modal = this.modalCtrl.create('PinCodePage', {
      message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
      outputPassword: true,
      validatePassword: true,
    });

    modal.onDidDismiss((password) => {
      if (!password) return;

      this.userDataProvider.encryptSecondPassphrase(this.wallet, password, this.passphrases.secondPassphrase).subscribe((data) => {
        this.wallet = this.userDataProvider.getWalletByAddress(this.wallet.address);
      });
    })

    modal.present();
  }

  showKeepSecondPassphrase() {
    if (this.transaction.type === TransactionType.SecondSignature || (this.wallet.secondSignature && !this.wallet.cipherPassphrase)) {
      if (this.response.status) return true;
    }

    return false;
  }

}
