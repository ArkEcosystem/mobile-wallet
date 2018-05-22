import { Component } from '@angular/core';
import { IonicPage, LoadingController, ViewController } from 'ionic-angular';
import { ToastProvider } from '@providers/toast/toast';
import { LoaderAutoConfigure, Network, NetworkType, Peer } from 'ark-ts';
import * as arkts from 'ark-ts';

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
                     private loadingCtrl: LoadingController) {
  }

  public dismiss(network?: Network): void {
    this.viewCtrl.dismiss(network);
  }

  public configure(): void {
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
