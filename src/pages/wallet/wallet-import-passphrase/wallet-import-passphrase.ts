import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Profile, Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { PrivateKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-passphrase.html',
})
export class WalletImportPassphrasePage {

  public currentProfile: Profile;
  public currentNetwork: Network;
  public passphrase = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private toastProvider: ToastProvider,
    private modalCtrl: ModalController,
  ) { }

  load() {
    this.currentProfile = this.userDataProvider.currentProfile;
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  submitForm() {
    const privateKey = PrivateKey.fromSeed(this.passphrase, this.currentNetwork);
    const publicKey = privateKey.getPublicKey();
    const address = publicKey.getAddress();

    let newWallet = new Wallet();

    this.arkApiProvider.api.account
      .get({ address })
      .finally(() => {
        const modal = this.modalCtrl.create('PinCodeModal', {
          message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
          outputPassword: true,
          validatePassword: true,
        });

        modal.onDidDismiss((password) => {
          if (password) {
            this.userDataProvider.addWallet(newWallet, this.passphrase, password).subscribe(() => {
              this.navCtrl.push('WalletDashboardPage', { address: newWallet.address })
                .then(() => {
                  this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1).then(() => {
                    this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
                  });
                });
            });
          } else {
            this.toastProvider.error('WALLETS_PAGE.ADD_WALLET_ERROR');
          }

        });

        modal.present();
      })
      .subscribe((response) => {
        if (response && response.success) {
          const account = response.account;

          newWallet = newWallet.deserialize(account);
        } else {
          newWallet.address = address;
          newWallet.publicKey = publicKey.toHex();
        }
      }, () => {
        // Empty wallet
        newWallet.address = address;
        newWallet.publicKey = publicKey.toHex();
      });
  }

  ionViewDidLoad() {
    this.load();
  }

}
