import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {
  public showingQrScanner: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner
  ) { }

  openWalletImportPassphrase() {
    this.navCtrl.push('WalletImportPassphrasePage');
  }

  scanQRCode() {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
       if (status.authorized) {
         let scanSub = this.qrScanner.scan().subscribe((text: string) => {
           this.qrScanner.hide(); // hide camera preview
           this.showingQrScanner = false;
           scanSub.unsubscribe(); // stop scanning
         });

         // show camera preview
         this.qrScanner.show();
         this.showingQrScanner = true;
       } else if (status.denied) {
         // camera permission was permanently denied
         // you must use QRScanner.openSettings() method to guide the user to the settings page
         // then they can grant the permission from there
       } else {
         // permission was denied, but not permanently. You can ask for permission again at a later time.
       }
    })
    .catch((e: any) => console.log('Error is', e));
  }

}
