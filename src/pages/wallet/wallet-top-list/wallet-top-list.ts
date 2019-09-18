import {Component, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform, Searchbar, Slides} from 'ionic-angular';
import {Wallet} from '@models/wallet';
import {Delegate, Network} from '@root/node_modules/ark-ts';
import {ArkApiProvider} from '@providers/ark-api/ark-api';
import {UserDataProvider} from '@providers/user-data/user-data';
import {ToastProvider} from '@providers/toast/toast';
import * as constants from '@app/app.constants';
import {Subject} from '@root/node_modules/rxjs';

@IonicPage()
@Component({
  selector: 'page-wallet-top-list',
  templateUrl: 'wallet-top-list.html',
})
export class WalletTopListPage implements OnDestroy {
  @ViewChild('topWalletSlider') slider: Slides;
  @ViewChild('searchbar') searchbar: Searchbar;

  public network: Network;
  public isSearch = false;
  public searchQuery = '';

  public topWallets: Wallet[] = [];

  private currentWallet: Wallet;
  private currentPage = 1;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private refreshListener;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
  ) {
    this.network = this.userDataProvider.currentNetwork;
  }

  openDetailModal(wallet: Wallet) {
    const modal = this.modalCtrl.create('TopWalletDetailsPage', {
      wallet: wallet
    }, { showBackdrop: true, enableBackdropDismiss: true });

    modal.present();
  }

  toggleSearchBar() {
    this.isSearch = !this.isSearch;
    if (this.isSearch) {
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 100);
    }
  }

  onUpdateTopWallets() {
    this.arkApiProvider.onUpdateTopWallets$.
      takeUntil(this.unsubscriber$)
      .do((topWallets) => {
        this.zone.run(() => {
          topWallets.forEach(wallet => {
            this.topWallets.push(wallet);
          });
        });
      })
      .subscribe();
  }

  ionViewDidEnter() {
    this.currentWallet = this.userDataProvider.currentWallet;

    this.onUpdateTopWallets();
    this.arkApiProvider.fetchTopWallets(constants.TOP_WALLETS_TO_FETCH, this.currentPage).subscribe();
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  getBalance(balance: string) {
    return Number(balance) / constants.WALLET_UNIT_TO_SATOSHI;
  }

  fetchWallets(infiniteScroll) {
    this.currentPage++;
    this.arkApiProvider.fetchTopWallets(constants.TOP_WALLETS_TO_FETCH, this.currentPage).subscribe(() => {
      infiniteScroll.complete();
    });
  }
}
