import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Delegate, Network, VoteType } from 'ark-ts';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'page-delegates',
  templateUrl: 'delegates.html',
})
export class DelegatesPage {

  public isSearch: boolean = false;
  public searchQuery: any = { username: ''};
  public delegates: Delegate[];
  public supply: number = 0;
  public preMinned: number = constants.BLOCKCHAIN_PREMINNED;

  public rankStatus: string = 'active';
  public currentNetwork: Network;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private refreshListener;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
  ) {
    this.currentNetwork = this.arkApiProvider.network;
    this.arkApiProvider.delegates.subscribe((data) => {
      this.zone.run(() => this.delegates = data);
    });
    this.arkApiProvider.fetchAllDelegates().subscribe();

    this.getSupply();
  }

  openDetailModal(delegate: Delegate) {
    let modal = this.modalCtrl.create('DelegateDetailPage', {
      delegate
    }, { cssClass: 'inset-modal-large', enableBackdropDismiss: true });

    modal.onDidDismiss((status) => {
      if (!status) return;

      this.getPassphrases().then((passphrases) => {
        if (!passphrases) return;

        // TODO: Vote type
        this.arkApiProvider.api.transaction.createVote({
          delegatePublicKey: delegate.publicKey,
          passphrase: passphrases['passphrase'],
          secondPassphrase: passphrases['secondPassphrase'],
          type: VoteType.Add
        });

        // TODO: Confirm transaction
      }, () => {
        // TODO: Toast error
      })
    });

    modal.present();
  }

  toggleSearchBar() {
    this.searchQuery.username = '';
    this.isSearch = !this.isSearch;
  }

  onInputSearch(evt) {

  }

  getTotalForged() {
    let forged = this.supply === 0 ? 0 : this.supply - this.preMinned;

    return forged;
  }

  private getPassphrases(message?: string) {
    let msg = message || 'PIN_CODE.TYPE_PIN_SIGN_TRANSACTION';
    let modal = this.modalCtrl.create('PinCodePage', {
      message: msg,
      outputPassword: true,
      validatePassword: true,
    });

    modal.present();

    return new Promise((resolve, reject) => {
      modal.onDidDismiss((password) => {
        if (!password) return reject();

        // TODO: Get current wallet
        // let passphrases = this.userDataProvider.getPassphrasesByWallet(this.wallet, password);
        // resolve(passphrases);
      });
    });
  }

  private getSupply() {
    this.arkApiProvider.api.block.blockchainStatus().takeUntil(this.unsubscriber$).subscribe((data) => {
      if (data.success) {
        this.zone.run(() => this.supply = data.supply);
      }
    })
  }

  private onUpdateDelegates() {
    this.arkApiProvider.onUpdateDelegates$
      .takeUntil(this.unsubscriber$)
      .do((delegates) => {
        this.zone.run(() => this.delegates = delegates)
      })
      .subscribe();
  }

  ionViewDidLoad() {
    this.onUpdateDelegates();
    this.refreshListener = setInterval(() => {
      this.getSupply();
    }, constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
