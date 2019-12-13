import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import lodash from 'lodash';
import { Network } from 'ark-ts/model';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ModalController } from '@ionic/angular';
import { EditNetworkAction, EditNetworkResult, CustomNetworkEditModal } from '@/app/modals/custom-network-edit/custom-network-edit';
import { ToastProvider } from '@/services/toast/toast';
import { CustomNetworkCreateModal } from '@/app/modals/custom-network-create/custom-network-create';


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
                          .every(defaultNetwork => this.networks[id].name !== defaultNetwork.name))
        .map(id => {
          return {name: this.networks[id].name, id: id};
         });
  }

  public async createNewModal() {
    const modal = await this.modalCtrl.create({
      component: CustomNetworkCreateModal
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) {
        return;
      }
      this.openManageDialog(data);
    });

    modal.present();
  }

  private async openManageDialog(network: Network, networkId?: string) {
    const modal = await this.modalCtrl.create({
      component: CustomNetworkEditModal,
      componentProps: {
        network: network,
        id: networkId
      }
    });
  
    modal.onDidDismiss().then(({ data }) => {
      if (!data) {
        return;
      }

      if (this.showSuccessMessages) {
        if (data.action === EditNetworkAction.Update) {
          this.toastProvider.success('CUSTOM_NETWORK.SAVE_SUCCESSFUL');
        } else if (data.action === EditNetworkAction.Delete) {
          this.toastProvider.success('CUSTOM_NETWORK.DELETE_SUCCESSFUL');
        }
      }

      this.loadNetworks();

      const filteredNetworks = this.networkChoices.filter(n => n.id === data.networkId);
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
