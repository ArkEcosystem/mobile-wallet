import { Component } from '@angular/core';
import { App, IonicPage, ViewController, Events } from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { ToastProvider } from '@providers/toast/toast';

@IonicPage()
@Component({
  selector: 'modal-qr-scanner',
  templateUrl: 'qr-scanner.html',
  providers: [],
})
export class QRScannerModal {

  constructor(
    private app: App,
    private events: Events,
    private qrScanner: QRScanner,
    private toastProvider: ToastProvider,
    private viewCtrl: ViewController
  ) {
    this.scanQrCode();
  }

  private scanQrCode(): void {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          let qrCodeJson: object = JSON.parse(qrCode);

          scanSub.unsubscribe();
          this.dismiss(qrCodeJson);
        });
        this.showCamera();
      } else if (status.denied) {
        this.toastProvider.error('QR_CODE.PERMISSION_PERMANENTLY_DENIED');
        this.dismiss();
      } else {
        this.toastProvider.error('QR_CODE.PERMISSION_DENIED');
        this.dismiss();
      }
    })
    .catch((e: any) => {
      this.toastProvider.error('QR_CODE.PROBLEM_TEXT');
      this.dismiss();
    });
  }

  private showCamera() {
    this.qrScanner.show();
    this.events.publish('qrScanner:show');
  }

  private hideCamera() {
    this.qrScanner.hide();
    this.events.publish('qrScanner:hide');
  }

  private dismiss(qrCode: object = null) {
    this.viewCtrl.dismiss(qrCode);
  }

  ionViewDidLeave() {
    this.hideCamera();
  }

}
