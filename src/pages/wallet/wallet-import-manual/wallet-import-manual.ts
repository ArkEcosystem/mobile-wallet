import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { NetworkProvider } from '@providers/network/network';
import { BaseWalletImport } from '@root/src/pages/wallet/wallet-import/wallet-import.base';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-manual.html',
})
export class WalletManualImportPage extends BaseWalletImport  {

  public addressOrPassphrase: string;
  public useAddress: boolean;

  constructor(
    navParams: NavParams,
    navCtrl: NavController,
    userDataProvider: UserDataProvider,
    arkApiProvider: ArkApiProvider,
    toastProvider: ToastProvider,
    modalCtrl: ModalController,
    networkProvider: NetworkProvider) {
    super(navParams, navCtrl, userDataProvider, arkApiProvider, toastProvider, modalCtrl, networkProvider);
    this.useAddress = navParams.get('type') === 'address';
  }

  submitForm() {
    this.import(this.useAddress ? this.addressOrPassphrase : null,
                this.useAddress ? null : this.addressOrPassphrase);
  }
}
