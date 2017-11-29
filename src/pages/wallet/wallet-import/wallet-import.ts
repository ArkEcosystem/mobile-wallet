import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';
import { PrivateKey, PublicKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {
  public showingQrScanner: boolean = false;
  public currentNetwork: Network;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner,
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
    let $this = this;
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          qrCode = JSON.parse(qrCode);

          if (qrCode['a'] || qrCode['passphrase']) {
            let privateKey = null;
            let publicKey = null;
            let address = qrCode['a'] || null;
            let passphrase = qrCode['passphrase'] || null;
            if (address) {
              publicKey = PublicKey.fromAddress(address);
              publicKey.setNetwork($this.currentNetwork);
            } else {
              privateKey = PrivateKey.fromSeed(passphrase, $this.currentNetwork);
              publicKey = privateKey.getPublicKey();
              address = publicKey.getAddress();
            }

            let newWallet = new Wallet(!privateKey);
            $this.arkApiProvider.api.account
              .get({ address })
              .finally(() => {
                if (privateKey) {
                  let modal = this.modalCtrl.create('PinCodeModal', {
                    message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
                    outputPassword: true,
                    validatePassword: true,
                  });

                  modal.onDidDismiss((password) => {
                    if (password) {
                      this.userDataProvider.addWallet(newWallet, privateKey.toWIF(), password).subscribe((result) => {
                        this.navCtrl.push('WalletDashboardPage', { address: newWallet.address });
                      });
                    } else {
                      this.toastProvider.error('WALLETS_PAGE.ADD_WALLET_ERROR');
                    }
                  });

                  modal.present();
                } else {
                  this.userDataProvider.addWallet(newWallet, null, '').subscribe((result) => {
                    this.navCtrl.push('WalletDashboardPage', { address: newWallet.address });
                  });
                }
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

          this.qrScanner.hide();
          $this.showingQrScanner = false;
          scanSub.unsubscribe();
        });
        this.qrScanner.show();
        this.showingQrScanner = true;
      } else if (status.denied) {
        this.toastProvider.error('QR_CODE.PERMISSION_PERMANENTLY_DENIED');
      } else {
        this.toastProvider.error('QR_CODE.PERMISSION_DENIED');
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }

}
