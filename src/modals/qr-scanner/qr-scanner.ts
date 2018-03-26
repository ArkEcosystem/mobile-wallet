import { Component } from '@angular/core';
import { IonicPage, ViewController, Events } from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { ToastProvider } from '@providers/toast/toast';
import { Vibration } from '@ionic-native/vibration';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'modal-qr-scanner',
  templateUrl: 'qr-scanner.html',
  providers: [Vibration],
})
export class QRScannerModal {

  private ionApp: HTMLElement;

  constructor(
    private events: Events,
    private qrScanner: QRScanner,
    private toastProvider: ToastProvider,
    private viewCtrl: ViewController,
    private vibration: Vibration,
  ) {
    this.scanQrCode();
  }

  private scanQrCode(): void {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];
        const scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          this.vibration.vibrate(constants.VIBRATION_TIME_MS);

          let response;

          try {
            response = JSON.parse(qrCode);
          } catch {
            response = qrCode;
          }

          this.hideCamera();
          scanSub.unsubscribe();
          this.dismiss(response);
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
    .catch(() => {
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
      this.ionApp.classList.remove('transparent');
    });

    this.viewCtrl.dismiss(qrCode);
  }

  ionViewDidLeave() {
    this.hideCamera();
    this.qrScanner.destroy();
  }

}
