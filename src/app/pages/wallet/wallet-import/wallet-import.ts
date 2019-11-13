import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { QRCodeScheme } from '@/models/model';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import { ToastProvider } from '@/services/toast/toast';
import { QRScannerComponent } from '@/components/qr-scanner/qr-scanner';
import { BaseWalletImport } from '@/app/pages/wallet/wallet-import/wallet-import.base';
import { NetworkProvider } from '@/services/network/network';
import { SettingsDataProvider } from '@/services/settings-data/settings-data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
  styleUrls: ['wallet-import.scss']
})
export class WalletImportPage extends BaseWalletImport {
  @ViewChild('qrScanner', { read: QRScannerComponent, static: true })
  qrScanner: QRScannerComponent;

  constructor(
    route: ActivatedRoute,
    navCtrl: NavController,
    userDataProvider: UserDataProvider,
    arkApiProvider: ArkApiProvider,
    toastProvider: ToastProvider,
    modalCtrl: ModalController,
    networkProvider: NetworkProvider,
    settingsDataProvider: SettingsDataProvider
  ) {
    super(route, navCtrl, userDataProvider, arkApiProvider, toastProvider, modalCtrl, networkProvider, settingsDataProvider);
  }

  openManualImportPage(type: string) {
    this.navCtrl.navigateForward('/wallets/import-manual', {
      queryParams: {
        type: type,
        address: this.existingAddress
      }
    });
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
