import { Component } from '@angular/core';
import { IonicPage, LoadingController, ViewController } from 'ionic-angular';
import { ToastProvider } from '@providers/toast/toast';
import { LoaderAutoConfigure, Network, NetworkType, Peer, PeerVersion2ConfigResponse } from 'ark-ts';
import * as arkts from 'ark-ts';
import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'customNetworkCreate',
  templateUrl: 'custom-network-create.html'
})
export class CustomNetworkCreateModal {

  public network: Network = new Network();
  public name: string;
  public seedServer: string;
  public isVersion2: boolean;

  public constructor(private viewCtrl: ViewController,
                     private toastProvider: ToastProvider,
                     private loadingCtrl: LoadingController) {
  }

  public dismiss(network?: Network): void {
    this.viewCtrl.dismiss(network);
  }

  public configure(): void {
    if (this.isVersion2) {
      return this.configureVersion2();
    }

    const loading = this.loadingCtrl.create();
    loading.present();

    const seedServerUrl = this.getSeedServerUrl();
    new arkts.Client(Network.getDefault(NetworkType.Mainnet))
      .loader.autoConfigure(seedServerUrl.origin)
      .finally(() => loading.dismiss())
      .subscribe((r: LoaderAutoConfigure) => {
        if (!r.success) {
          this.configureError();
          return;
        }

        this.network.name = this.name;
        this.network.nethash = r.network.nethash;
        this.network.token = r.network.token;
        this.network.symbol = r.network.symbol;
        this.network.explorer = r.network.explorer;
        this.network.version = r.network.version;
        this.network.activePeer = new Peer();
        this.network.activePeer.ip = seedServerUrl.hostname;
        this.network.activePeer.port = Number(seedServerUrl.port);
        this.network.type = null;
        this.dismiss(this.network);
      }, () => this.configureError());
  }

  private configureVersion2(): void {
    const loading = this.loadingCtrl.create();
    loading.present();

    const seedServerUrl = this.getSeedServerUrl();
    new arkts.Client(Network.getDefault(NetworkType.Mainnet))
      .peer.getVersion2Config(seedServerUrl.hostname, Number(seedServerUrl.port))
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
        this.network.activePeer = new Peer();
        this.network.activePeer.ip = seedServerUrl.hostname;
        this.network.activePeer.port = Number(seedServerUrl.port);
        this.network.type = null;

        const apiConfig = lodash.get(r, 'data.plugins["@arkecosystem/core-api"]');
        if (!apiConfig || !apiConfig.enabled || !apiConfig.port) {
          this.configureError();
          return;
        }
        this.network.apiPort = apiConfig.port;
        this.network.p2pPort = Number(seedServerUrl.port);
        this.network.p2pVersion = '2.0.0';
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
