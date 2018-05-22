import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import lodash from 'lodash';
import { Network } from 'ark-ts/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ModalController } from 'ionic-angular';
import { EditNetworkAction, EditNetworkResult } from '@root/src/modals/custom-network-edit/custom-network-edit';
import { ToastProvider } from '@providers/toast/toast';


@Component({
  selector: 'customNetwork',
  templateUrl: 'custom-network.html'
})
export class CustomNetworkComponent implements OnInit {

  @Output()
  public onNetworkChange: EventEmitter<string> = new EventEmitter();

  @Input()
  public openManageDialogOnSelect: boolean;

  @Input()
  public showSuccessMessages: boolean;

  public networks: { [networkId: string]: Network };
  public networksIds: string[];
  public networkChoices: { name: string, id?: string }[] = [];

  public activeNetworkChoice: { name: string, id?: string };

  public constructor(private userDataProvider: UserDataProvider,
                     private modalCtrl: ModalController,
                     private toastProvider: ToastProvider) {
  }

  public ngOnInit() {
    this.loadNetworks();
  }

  private loadNetworks(): void {
    this.networks = this.userDataProvider.networks;
    this.networksIds = lodash.keys(this.networks);
    this.networkChoices = this.networksIds
        .filter(id => this.userDataProvider
                          .defaultNetworks
                          .every(defaultNetwork => this.networks[id].nethash !== defaultNetwork.nethash))
        .map(id => {
          return {name: this.networks[id].name, id: id};
         });
  }

  public createNewModal(): void {
    const modal = this.modalCtrl.create('CustomNetworkCreateModal');

    modal.onDidDismiss((result: Network) => {
      if (!result) {
        return;
      }
      this.openManageDialog(result);
    });

    modal.present();
  }

  private openManageDialog(network: Network, networkId?: string) {
    const modal = this.modalCtrl.create('CustomNetworkEditModal', {network: network, id: networkId});
    modal.onDidDismiss((result: EditNetworkResult) => {
      if (!result) {
        return;
      }

      if (this.showSuccessMessages) {
        if (result.action === EditNetworkAction.Update) {
          this.toastProvider.success('CUSTOM_NETWORK.SAVE_SUCCESSFUL');
        } else if (result.action === EditNetworkAction.Delete) {
          this.toastProvider.success('CUSTOM_NETWORK.DELETE_SUCCESSFUL');
        }
      }

      this.loadNetworks();

      const filteredNetworks = this.networkChoices.filter(n => n.id === result.networkId);
      if (filteredNetworks.length) {
        this.activeNetworkChoice = filteredNetworks[0];
      } else {
        this.activeNetworkChoice = null;
      }
      this.emitActiveNetwork();
    });
    modal.present();
  }

  public onActiveNetworkChange(): void {
    if (this.openManageDialogOnSelect) {
      this.openManageDialog(this.networks[this.activeNetworkChoice.id], this.activeNetworkChoice.id);
    } else {
      this.emitActiveNetwork();
    }
  }

  private emitActiveNetwork() {
    this.onNetworkChange.next(this.activeNetworkChoice ? this.activeNetworkChoice.id : null);
  }
}
