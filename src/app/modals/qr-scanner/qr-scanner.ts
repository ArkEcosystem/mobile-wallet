import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { ToastProvider } from '@/services/toast/toast';
import { Vibration } from '@ionic-native/vibration/ngx';

import * as constants from '@/app/app.constants';
import { EventBusProvider } from '@/services/event-bus/event-bus';

@Component({
  selector: 'modal-qr-scanner',
  templateUrl: 'qr-scanner.html',
  styleUrls: ['qr-scanner.scss'],
  providers: [Vibration],
})
export class QRScannerModal implements OnDestroy {

  private ionApp: HTMLElement;

  constructor(
    private eventBus: EventBusProvider,
    private qrScanner: QRScanner,
    private toastProvider: ToastProvider,
    private modalCtrl: ModalController,
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
    this.eventBus.emit('qrScanner:show');
  }

  private hideCamera() {
    this.qrScanner.hide();
    this.eventBus.emit('qrScanner:hide');
  }

  public dismiss(qrCode: object = null) {
    this.qrScanner.getStatus().then((status: QRScannerStatus) => {
      if (status.showing) {
        this.hideCamera();
      }
      this.ionApp.classList.remove('transparent');
    });

    this.modalCtrl.dismiss(qrCode);
  }

  ngOnDestroy() {
    this.hideCamera();
    this.qrScanner.destroy();
  }

}
