import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';
import bip39 from 'bip39';

import { ArkApiProvider } from '@providers/ark-api/ark-api';

@IonicPage()
@Component({
  selector: 'page-register-second-passphrase',
  templateUrl: 'register-second-passphrase.html',
  providers: [Clipboard],
})
export class RegisterSecondPassphrasePage {
  public fee;
  public symbol;
  public passphrase: string;
  public repassphrase: string;

  public isBip39: boolean = false;
  public isInvalidPassphrase: boolean = true;
  public isInvalidForm: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private clipboard: Clipboard,
    private arkApiProvider: ArkApiProvider,
  ) {
    this.arkApiProvider.fees.subscribe((fees) => this.fee = fees.delegate);
    this.symbol = this.arkApiProvider.network.symbol;
  }

  copyPassphrase() {
    this.clipboard.copy(this.passphrase);
  }

  validatePassphrase() {
    if (!this.isInvalidPassphrase) {
      this.repassphrase = '';
    }

    if (this.passphrase.length < 3) {
      this.isInvalidPassphrase = true;
      return;
    }

    this.isInvalidPassphrase = false;
  }

  validateRepassphrase() {
    this.isInvalidForm = this.passphrase !== this.repassphrase;
  }

  openGenerateEntropy() {
    let modal = this.modalCtrl.create('GenerateEntropyPage');

    modal.onDidDismiss((entropy) => {
      if (!entropy) return;

      let showModal = this.modalCtrl.create('WalletCreatePage', {
        entropy,
        disableShowDetails: true,
        fee: this.fee,
        message: 'WALLETS_PAGE.BACKUP_SECOND_PASSPHRASE',
        title: 'WALLETS_PAGE.SECOND_PASSPHRASE',
      });

      showModal.onDidDismiss((account) => {
        if (!account) return;
        this.isInvalidForm = false;
        this.passphrase = account.mnemonic;
        this.submitForm();
      });

      showModal.present();
    });

    modal.present();
  }

  generate() {
    this.isBip39 = true;
    this.isInvalidForm = false;
    this.passphrase = bip39.generateMnemonic();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    if (this.isInvalidForm) return;

    this.viewCtrl.dismiss(this.passphrase);
  }

}
