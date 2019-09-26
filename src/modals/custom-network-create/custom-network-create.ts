import { Component } from '@angular/core';
import { IonicPage, LoadingController, ViewController } from 'ionic-angular';
import { ToastProvider } from '@providers/toast/toast';
import { LoaderAutoConfigure, Network, Peer, PeerVersion2ConfigResponse } from 'ark-ts';
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
    const protocol = seedServerUrl.protocol === 'https:' ? 'https' : 'http';

    new ArkClient(this.seedServer, this.httpClient)
      .getPeerConfig(seedServerUrl.hostname, Number(seedServerUrl.port), protocol)
      .finally(() => loading.dismiss())
      .subscribe((r: PeerVersion2ConfigResponse) => {
        if (!r.data) {
          this.configureError();
          return;
        }

        this.network.name = this.name;
        this.network.nethash = lodash.get(r, 'data.network.nethash');
        this.network.token = lodash.get(r, 'data.network.token.name');
        this.network.symbol = lodash.get(r, 'data.network.token.symbol');
        this.network.explorer = lodash.get(r, 'data.network.explorer');
        this.network.version = lodash.get(r, 'data.network.version');
        this.network.type = null;

        const apiConfig: any = lodash.find(r.data.plugins, (_, key) => key.split('/').reverse()[0] === 'core-api');
        if (!r.data.plugins || !apiConfig || !apiConfig.enabled || !apiConfig.port) {
          this.configureError();
          return;
        }
        this.network.apiPort = apiConfig.port;
        this.network.p2pPort = Number(seedServerUrl.port);
        this.network.p2pVersion = '2.0.0';

        this.network.activePeer = new Peer();
        this.network.activePeer.ip = seedServerUrl.hostname;
        this.network.activePeer.port = this.network.apiPort;

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
