import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'customNetworkManageModal',
  templateUrl: 'custom-network-manage.html'
})
export class CustomNetworkManageModal {

  public constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
