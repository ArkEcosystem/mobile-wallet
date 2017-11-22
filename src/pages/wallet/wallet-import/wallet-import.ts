import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
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
    private modalCtrl: ModalController,
  ) {
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  openWalletImportPassphrase() {
    this.navCtrl.push('WalletImportPassphrasePage');
  }

  scanQRCode() {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        let $this = this;
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          console.log('qrCode raw', qrCode);
          qrCode = JSON.parse(qrCode);
          console.log('qrCode', qrCode);

          if (qrCode['a'] || qrCode['passphrase']) {
            let privateKey = null;
            let publicKey = null;
            let address = qrCode['a'] || null;
            let passphrase = qrCode['passphrase'] || null;
            console.log('address', address);
            if (address) {
              publicKey = PublicKey.fromAddress(address);
              publicKey.setNetwork($this.currentNetwork);
            } else {
              privateKey = PrivateKey.fromSeed(passphrase, $this.currentNetwork);
              publicKey = privateKey.getPublicKey();
              address = publicKey.getAddress();
            }

            console.log('watch only', !privateKey);
            console.log('watch only 2', !passphrase);

            let newWallet = new Wallet(!privateKey);
            $this.arkApiProvider.api.account
              .get({ address })
              .finally(() => {
                let modal = this.modalCtrl.create('PinCodePage', {
                  message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
                  outputPassword: true,
                  validatePassword: true,
                });

                modal.onDidDismiss((password) => {
                  if (password) {
                    this.userDataProvider.addWallet(newWallet, passphrase || '', password).subscribe((result) => {
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

          this.qrScanner.hide();
          $this.showingQrScanner = false;
          scanSub.unsubscribe();
        });
        this.qrScanner.show();
        this.showingQrScanner = true;
      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there

        // TODO: Toast error
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.

        // TODO: Toast error
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }

}
