import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';
import { Delegate, Network, VoteType, PrivateKey, TransactionVote } from 'ark-ts';

import { Wallet, Transaction, WalletKeys } from '@models/model';

import * as constants from '@app/app.constants';
import lodash from 'lodash';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@components/confirm-transaction/confirm-transaction';

@IonicPage()
@Component({
  selector: 'page-delegates',
  templateUrl: 'delegates.html',
})
export class DelegatesPage {

  @ViewChild('pinCode') pinCode: PinCodeComponent;
  @ViewChild('confirmTransaction') confirmTransaction: ConfirmTransactionComponent;

  public isSearch: boolean = false;
  public searchQuery: any = { username: ''};
  public delegates: Delegate[];
  public supply: number = 0;
  public preMinned: number = constants.BLOCKCHAIN_PREMINNED;

  public rankStatus: string = 'active';
  public currentNetwork: Network;

  private selectedDelegate: Delegate;

  private currentWallet: Wallet;
  private walletVote: Delegate;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private refreshListener;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
  ) { }

  openDetailModal(delegate: Delegate) {
    this.selectedDelegate = delegate;

    let modal = this.modalCtrl.create('DelegateDetailPage', {
      delegate,
      vote: this.walletVote,
    }, { cssClass: 'inset-modal-large', showBackdrop: false, enableBackdropDismiss: true });

    modal.onDidDismiss((voter) => {
      if (!voter) return;

      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true, true);

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

  isSameDelegate(delegatePublicKey) {
    if (this.currentWallet && this.walletVote && this.walletVote.publicKey === delegatePublicKey) {
      return true;
    }

    return false;
  }

  generateTransaction(keys: WalletKeys) {
    let type = VoteType.Add;

    if (this.walletVote && this.walletVote.publicKey === this.selectedDelegate.publicKey) type = VoteType.Remove;

    let data: TransactionVote = {
      delegatePublicKey: this.selectedDelegate.publicKey,
      passphrase: PrivateKey.fromWIF(keys.key, this.currentNetwork),
      type,
    };

    if (keys.secondKey) data.secondPassphrase = PrivateKey.fromWIF(keys.secondKey, this.currentNetwork);

    this.arkApiProvider.api.transaction.createVote(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, keys);
    });
  }

  private fetchCurrentVote() {
    if (!this.currentWallet) return;

    this.arkApiProvider.api.account
      .votes({ address: this.currentWallet.address })
      .takeUntil(this.unsubscriber$)
      .subscribe((data) => {
        console.log(data);
        if (data.success && data.delegates.length > 0) {
          this.walletVote = data.delegates[0];
        }
      }, () => {
        this.toastProvider.error('DELEGATES_PAGE.VOTE_FETCH_ERROR');
      });
  }

  // DEPRECATED:
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

  ionViewDidEnter() {
    this.currentNetwork = this.arkApiProvider.network;
    this.currentWallet = this.userDataProvider.currentWallet;

    this.arkApiProvider.delegates.subscribe((data) => this.zone.run(() => this.delegates = data));

    this.onUpdateDelegates();
    // this.getSupply();
    this.fetchCurrentVote();
    this.arkApiProvider.fetchAllDelegates().subscribe();

    // this.refreshListener = setInterval(() => this.getSupply(), constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
