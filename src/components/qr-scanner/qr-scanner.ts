import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

import lodash from 'lodash';

@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html'
})
export class QRScannerComponent {

  @Output('onSuccess') onSuccess: EventEmitter<object> = new EventEmitter();
  @Output('onWrong') onWrong: EventEmitter<void> = new EventEmitter();

  constructor(private modalCtrl: ModalController) { }

  open() {
    let modal = this.modalCtrl.create('QRScannerModal');

    modal.onDidDismiss((qrCode) => {
      if (lodash.isNil(qrCode)) return this.onWrong.emit();

      return this.onSuccess.emit(qrCode);
    });

    modal.present();
  }

}
