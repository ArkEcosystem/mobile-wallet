import { Component } from '@angular/core';
import { App, IonicPage, ViewController, Events, Platform } from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { ToastProvider } from '@providers/toast/toast';
import { setTimeout } from 'timers';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'modal-qr-scanner',
  templateUrl: 'qr-scanner.html',
  providers: [StatusBar],
})
export class QRScannerModal {

  private ionApp: HTMLElement;

  constructor(
    private app: App,
    private events: Events,
    private qrScanner: QRScanner,
    private toastProvider: ToastProvider,
    private viewCtrl: ViewController,
    private statusBar: StatusBar,
    private platform: Platform,
  ) {
    this.scanQrCode();
  }

  private scanQrCode(): void {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          let qrCodeJson: object = JSON.parse(qrCode);
          this.hideCamera();
          scanSub.unsubscribe();
          this.dismiss(qrCodeJson);
        });

        this.ionApp.classList.add('transparent');
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
    this.qrScanner.getStatus().then((status: QRScannerStatus) => {
      if (status.showing) {
        this.hideCamera();
      }
    });

    this.ionApp.classList.remove('transparent');
    this.viewCtrl.dismiss(qrCode);
  }

  ionViewDidLeave() {
    this.hideCamera();
    this.qrScanner.destroy();
  }

}
