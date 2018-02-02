import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { Wallet, QRCodeScheme } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';
import { PrivateKey, PublicKey, Network } from 'ark-ts';

import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  public currentNetwork: Network;

  constructor(
    private navCtrl: NavController,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private toastProvider: ToastProvider,
    private modalCtrl: ModalController,
  ) {
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  openWalletImportPassphrase() {
    this.navCtrl.push('WalletImportPassphrasePage');
  }

  scanQRCode() {
    this.qrScanner.open(true);
  }

  onScanQRCode(qrCode: QRCodeScheme) {
    if (qrCode.address || qrCode.passphrase) {
      let privateKey = null;
      let publicKey = null;
      let address = qrCode.address || null;
      const passphrase = qrCode.passphrase || null;
      if (address) {
        if (PublicKey.validateAddress(address, this.currentNetwork)) {
          publicKey = PublicKey.fromAddress(address);
          publicKey.setNetwork(this.currentNetwork);
        } else {
          this.toastProvider.error('WALLETS_PAGE.IMPORT_INVALID_ADDRESS');
        }
      } else {
        privateKey = PrivateKey.fromSeed(passphrase, this.currentNetwork);
        publicKey = privateKey.getPublicKey();
        address = publicKey.getAddress();
      }

      if (!publicKey) { return; }

      let newWallet = new Wallet(!privateKey);
      this.arkApiProvider.api.account
        .get({ address })
        .finally(() => {
          if (privateKey) {
            const modal = this.modalCtrl.create('PinCodeModal', {
              message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
              outputPassword: true,
              validatePassword: true,
            });

            modal.onDidDismiss((password) => {
              if (password) {
                this.userDataProvider.addWallet(newWallet, passphrase, password).subscribe(() => {
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
          } else {
            this.userDataProvider.addWallet(newWallet, null, '').subscribe(() => {
              this.navCtrl.push('WalletDashboardPage', { address: newWallet.address })
                .then(() => {
                  this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
                });
            });
          }
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
          newWallet.address = address;
          newWallet.publicKey = publicKey.toHex();
        });
    } else {
      this.toastProvider.error('QR_CODE.INVALID_QRCODE');
    }
  }

}
