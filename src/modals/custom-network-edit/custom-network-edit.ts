import { Component } from '@angular/core';
import { AlertController, IonicPage, NavParams, ViewController } from 'ionic-angular';
import { StoredNetwork } from '@models/stored-network';
import { UserDataProvider } from '@providers/user-data/user-data';
import { TranslateService } from '@ngx-translate/core';
import lodash from 'lodash';
import { ToastProvider } from '@providers/toast/toast';

export enum EditNetworkAction {
  Update,
  Delete
}
export interface EditNetworkResult {
  networkId: string;
  action: EditNetworkAction;
}

@IonicPage()
@Component({
  selector: 'customNetworkEdit',
  templateUrl: 'custom-network-edit.html'
})
export class CustomNetworkEditModal {

  public network: StoredNetwork = new StoredNetwork();
  public apiPort: number;
  public p2pPort: number;
  public networkId: string;

  public constructor(public navParams: NavParams,
                     private viewCtrl: ViewController,
                     private alertCtrl: AlertController,
                     private userDataProvider: UserDataProvider,
                     private translateService: TranslateService,
                     private toastProvider: ToastProvider) {
    this.network = this.navParams.get('network') || {};
    this.networkId = this.navParams.get('id');
    this.apiPort = this.network.isV2 ? this.network.apiPort : this.network.activePeer.port;
    this.p2pPort = this.network.isV2 ? this.network.p2pPort : this.network.activePeer.port;
  }

  dismiss(result?: EditNetworkResult) {
    this.viewCtrl.dismiss(result);
  }

  public updateApiPort() {
    this.network.apiPort = this.apiPort;
  }

  public updateP2PPort() {
    if (this.network.isV2) {
      this.network.p2pPort = this.p2pPort;
    }
    this.network.activePeer.port = this.p2pPort;
  }

  public save(): void {
    this.userDataProvider
        .addOrUpdateNetwork(this.network, this.networkId)
        .subscribe(network => this.dismiss({action: EditNetworkAction.Update, networkId: network.id}));
  }

  public prepareDelete(): void {
    if (lodash.some(this.userDataProvider.profiles, p => p.networkId === this.networkId)) {
      this.toastProvider.error('CUSTOM_NETWORK.DELETE_FAIL_NOT_EMPTY');
      return;
    }

    this.translateService.get(['CUSTOM_NETWORK.CONFIRM_DELETE', 'NO', 'YES']).subscribe(translations => {
      const alert = this.alertCtrl.create({
        title: translations['CUSTOM_NETWORK.CONFIRM_DELETE'],
        buttons: [
          {
            text: translations['NO'],
            role: 'cancel',
            handler: () => {}
          },
          {
            text: translations['YES'],
            handler: () => this.delete()
          }
          ]
      });
      alert.present();
    });
  }

  private delete(): void {
    this.userDataProvider
        .removeNetworkById(this.networkId)
        .subscribe(() => this.dismiss({action: EditNetworkAction.Delete, networkId: this.networkId}));
  }
}
