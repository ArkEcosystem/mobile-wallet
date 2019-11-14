import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, IonContent } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { UserDataProvider } from '@/services/user-data/user-data';
import { ToastProvider } from '@/services/toast/toast';

import { Transaction, Wallet, WalletKeys, StoredNetwork } from '@/models/model';
import { TransactionType, Network } from 'ark-ts';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-transaction-response',
  templateUrl: 'transaction-response.html',
  styleUrls: ['transaction-response.scss'],
  providers: [Clipboard, InAppBrowser],
})
export class TransactionResponsePage {
  @ViewChild('content', { read: IonContent, static: true })
  content: IonContent;

  public transaction: Transaction;
  public wallet: Wallet;
  public keys: WalletKeys = {};
  public response: any = { status: false, message: '' };

  public showKeepSecondPassphrase = true;
  public currentNetwork: StoredNetwork;

  constructor(
    public navCtrl: NavController,
    private clipboard: Clipboard,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
    private iab: InAppBrowser,
    private route: ActivatedRoute
  ) {
    const wallet = this.route.snapshot.queryParamMap.get('wallet');
    const response = this.route.snapshot.queryParamMap.get('response');
    const keys = this.route.snapshot.queryParamMap.get('keys');

    const transaction = this.route.snapshot.queryParamMap.get('transaction');

    if (!this.response) { this.navCtrl.pop(); }

    this.currentNetwork = this.userDataProvider.currentNetwork;

    if (transaction) {
      this.wallet = JSON.parse(wallet);
      this.keys = JSON.parse(keys);
      this.response = JSON.parse(response);
      this.transaction = new Transaction(this.wallet.address, this.currentNetwork).deserialize(JSON.parse(transaction));
    }

    this.verifySecondPassphrasHasEncrypted();
  }

  copyTxid() {
    this.clipboard.copy(this.transaction.id).then(
      () => this.toastProvider.success('COPIED_CLIPBOARD'),
      () => this.toastProvider.error('COPY_CLIPBOARD_FAILED'));
  }

  openInExplorer() {
    const url = `${this.currentNetwork.explorer}/transaction/${this.transaction.id}`;
    return this.iab.create(url, '_system');
  }

  presentEncryptedAlert() {
    this.toastProvider.success('WALLETS_PAGE.ALERT_SUCCESSFULLY_ENCRYPTED_SECOND_PASSPHRASE');
  }

  async saveSecondPassphrase() {
    const modal = await this.modalCtrl.create({
      component: PinCodeModal,
      componentProps: {
        message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
        outputPassword: true,
        validatePassword: true,
      }
    });

    modal.onDidDismiss().then((({ data }) => {
      if (!data.password) { return; }

      this.userDataProvider.encryptSecondPassphrase(this.wallet, data.password, this.keys.secondPassphrase).subscribe(() => {
        this.wallet = this.userDataProvider.getWalletByAddress(this.wallet.address);

        this.showKeepSecondPassphrase = false;
        if (this.content) { this.content }
        this.presentEncryptedAlert();
      });
    }));

    modal.present();
  }

  verifySecondPassphrasHasEncrypted() {
    if (!this.transaction) { return; }

    if (this.transaction.type === TransactionType.SecondSignature || (this.wallet.secondPublicKey && !this.wallet.cipherSecondKey)) {
      if (this.response.status) { return this.showKeepSecondPassphrase = true; }
    }

    this.showKeepSecondPassphrase = false;
    // if (this.content) { this.content.resize(); }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
