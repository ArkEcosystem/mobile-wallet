import { Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, IonSearchbar, IonSlides } from '@ionic/angular';

import { Subject } from 'rxjs';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ToastProvider } from '@/services/toast/toast';
import { Delegate, VoteType, TransactionVote } from 'ark-ts';

import { Wallet, WalletKeys } from '@/models/model';
import { StoredNetwork } from '@/models/stored-network';

import * as constants from '@/app/app.constants';
import { PinCodeComponent } from '@/components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@/components/confirm-transaction/confirm-transaction';
import { DelegateDetailPage } from './delegate-detail/delegate-detail';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'page-delegates',
  templateUrl: 'delegates.html',
  styleUrls: ['delegates.pcss']
})
export class DelegatesPage implements OnDestroy {
  @ViewChild('delegateSlider', { read: IonSlides, static: false })
  slider: IonSlides;

  @ViewChild('pinCode', { read: PinCodeComponent, static: true })
  pinCode: PinCodeComponent;

  @ViewChild('confirmTransaction', { read: ConfirmTransactionComponent, static: true })
  confirmTransaction: ConfirmTransactionComponent;

  @ViewChild('searchbar', { read: IonSearchbar, static: false })
  searchbar: IonSearchbar;

  public isSearch = false;
  public searchQuery = '';

  public delegates: Delegate[];
  public activeDelegates: Delegate[];
  public standByDelegates: Delegate[];
  public allDelegates: [Delegate[], Delegate[]];

  public supply = 0;
  public preMined: number = constants.BLOCKCHAIN_PREMINED;

  public rankStatus = 'active';
  public currentNetwork: StoredNetwork;
  public slides: string[] = [
    'active',
    'standBy',
  ];

  private selectedDelegate: Delegate;
  private selectedFee: number;

  public currentWallet: Wallet;
  private walletVote: Delegate;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private refreshListener;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private arkApiProvider: ArkApiProvider,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
  ) {}

  async openDetailModal(delegate: Delegate) {
    const modal = await this.modalCtrl.create({
      showBackdrop: false,
      backdropDismiss: true,
      component: DelegateDetailPage,
      componentProps: {
        delegate,
        vote: this.walletVote
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data.delegateVote) { return; }

      this.selectedFee = data.fee;
      this.selectedDelegate = data.delegateVote; // Save the delegate that we want to vote for
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true, true);

    });

    await modal.present();
  }

  toggleSearchBar() {
    this.searchQuery = '';
    this.isSearch = !this.isSearch;
    if (this.isSearch) {
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 100);
    }
  }

  onSlideChanged() {
    this.slider.getActiveIndex().then(index => {
      this.rankStatus = this.slides[index];
    })
  }

  onSegmentChange() {
    this.slider.slideTo(this.slides.indexOf(this.rankStatus));
  }

  getTotalForged() {
    const forged = this.supply === 0 ? 0 : this.supply - this.preMined;

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

    if (this.walletVote && this.walletVote.publicKey === this.selectedDelegate.publicKey ) { type = VoteType.Remove; }

    const data: TransactionVote = {
      delegatePublicKey: this.selectedDelegate.publicKey,
      passphrase: keys.key,
      secondPassphrase: keys.secondKey,
      fee: this.selectedFee,
      type,
    };

    this.arkApiProvider.transactionBuilder.createVote(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, keys, null, { username: this.selectedDelegate.username });
    });
  }

  private fetchCurrentVote() {
    if (!this.currentWallet) { return; }

    this.arkApiProvider.client.getWalletVotes(this.currentWallet.address)
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((data) => {
        if (data.success && data.delegates.length > 0) {
          this.walletVote = data.delegates[0];
        }
      }, () => {
        this.toastProvider.error('DELEGATES_PAGE.VOTE_FETCH_ERROR');
      });
  }

  private onUpdateDelegates() {
    this.arkApiProvider.onUpdateDelegates$
      .pipe(
        takeUntil(this.unsubscriber$),
        tap((delegates) => {
          this.zone.run(() => this.delegates = delegates);
        })
      )
      .subscribe();
  }

  ionViewDidEnter() {
    this.currentNetwork = this.arkApiProvider.network;
    this.currentWallet = this.userDataProvider.currentWallet;
    this.zone.runOutsideAngular(() => {
      this.arkApiProvider.delegates.subscribe((data) => this.zone.run(() => {
        this.delegates = data;
        this.activeDelegates = this.delegates.slice(0, this.currentNetwork.activeDelegates);
        this.standByDelegates = this.delegates.slice(this.currentNetwork.activeDelegates, this.delegates.length);
        this.allDelegates = [this.activeDelegates, this.standByDelegates];
      }));
    });

    this.onUpdateDelegates();
    this.fetchCurrentVote();
    this.arkApiProvider.fetchDelegates(this.currentNetwork.activeDelegates * 2).subscribe();
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
