import { Component } from '@angular/core';
import { IonicPage, LoadingController, ViewController } from 'ionic-angular';
import { ToastProvider } from '@providers/toast/toast';
import { Network, Peer } from 'ark-ts';
import ArkClient from '@utils/ark-client';
import lodash from 'lodash';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'customNetworkCreate',
  templateUrl: 'custom-network-create.html'
})
export class CustomNetworkCreateModal {

  public network: Network = new Network();
  public name: string;
  public seedServer: string;

  public constructor(private viewCtrl: ViewController,
                     private toastProvider: ToastProvider,
                     private loadingCtrl: LoadingController,
                     private httpClient: HttpClient) {
  }

  public dismiss(network?: Network): void {
    this.viewCtrl.dismiss(network);
  }

  private configure(): void {
    const loading = this.loadingCtrl.create();
    loading.present();

    const seedServerUrl = this.getSeedServerUrl();

    new ArkClient(this.seedServer, this.httpClient)
      .getNodeConfiguration()
      .finally(() => loading.dismiss())
      .subscribe((response) => {
        this.network.name = this.name;
        this.network.nethash = response.nethash;
        this.network.token = response.token;
        this.network.symbol = response.symbol;
        this.network.explorer = response.explorer;
        this.network.version = response.version;
        this.network.type = null;

        const apiConfig: any = lodash.find(response.ports, (_, key) => key.split('/').reverse()[0] === 'core-api');
        if (!response.ports || !apiConfig) {
          this.configureError();
          return;
        }
        this.network.apiPort = apiConfig;

        this.network.activePeer = new Peer();
        this.network.activePeer.ip = seedServerUrl.hostname;
        this.network.activePeer.port = apiConfig;

        this.network.isV2 = true;
        this.dismiss(this.network);
      }, () => this.configureError());
  }

  public getSeedServerUrl(): URL {
    try {
      return new URL(this.seedServer);
    } catch (error) {
      return null;
    }
  }

  private configureError(): void {
    this.network = new Network();
    this.toastProvider.error('CUSTOM_NETWORK.CONFIGURE_ERROR');
  }
}
