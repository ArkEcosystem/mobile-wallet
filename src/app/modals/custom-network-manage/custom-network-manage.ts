import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'customNetworkManageModal',
  templateUrl: 'custom-network-manage.html'
})
export class CustomNetworkManageModal {

  public constructor(private modalCtrl: ModalController) {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
