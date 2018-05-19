import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { QRCodeScheme } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';
import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';
import { BaseWalletImport } from '@root/src/pages/wallet/wallet-import/wallet-import.base';
import { NetworkProvider } from '@providers/network/network';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage extends BaseWalletImport {
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  constructor(
    navParams: NavParams,
    navCtrl: NavController,
    userDataProvider: UserDataProvider,
    arkApiProvider: ArkApiProvider,
    toastProvider: ToastProvider,
    modalCtrl: ModalController,
    networkProvider: NetworkProvider,
    settingsDataProvider: SettingsDataProvider
  ) {
    super(navParams, navCtrl, userDataProvider, arkApiProvider, toastProvider, modalCtrl, networkProvider, settingsDataProvider);
  }

  openManualImportPage(type: string) {
    this.navCtrl.push('WalletManualImportPage', {type: type, address: this.existingAddress});
  }

  scanQRCode() {
    this.qrScanner.open(true);
  }

  onScanQRCode(qrCode: QRCodeScheme) {
    if (qrCode.address || qrCode.passphrase) {
      this.import(qrCode.address || null, qrCode.passphrase || null);
    } else {
      this.toastProvider.error('QR_CODE.INVALID_QRCODE');
    }
  }
}
