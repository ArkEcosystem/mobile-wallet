import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

import { Profile, Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';

import { PublicKey, PrivateKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-passphrase.html',
})
export class WalletImportPassphrasePage {

  public currentProfile: Profile;
  public currentNetwork: Network;
  public passphrase: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private loadingCtrl: LoadingController,
    private arkApiProvider: ArkApiProvider,
    private modalCtrl: ModalController,
  ) { }

  load() {
    this.currentProfile = this.userDataProvider.currentProfile;
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  submitForm() {
    let privateKey = PrivateKey.fromSeed(this.passphrase, this.currentNetwork);
    let publicKey = privateKey.getPublicKey();
    let address = publicKey.getAddress();

    let newWallet = new Wallet();

    this.arkApiProvider.api.account
      .get({ address })
      .finally(() => {
        let modal = this.modalCtrl.create('PinCodePage', {
          message: 'IMPORT_WALLET.TYPE_PIN_MESSAGE',
          outputPassword: true,
          validatePassword: true,
        });

        modal.onDidDismiss((password) => {
          if (password) {
            this.userDataProvider.addWallet(newWallet, this.passphrase, password).subscribe((result) => {
              this.navCtrl.setRoot('WalletDashboardPage', { address: newWallet.address });
            });
          } else {
            // TODO: Toast error
          }

        });

        modal.present();
      })
      .subscribe((response) => {
        if (response && response.success) {
          let account = response.account;

          newWallet = newWallet.deserialize(account);
        } else {
          newWallet.address = address;
          newWallet.publicKey = publicKey.toHex();
        }
      }, () => {
        newWallet.address = address;
        newWallet.publicKey = publicKey.toHex();
      });
  }

  ionViewDidLoad() {
    this.load();
  }

}
