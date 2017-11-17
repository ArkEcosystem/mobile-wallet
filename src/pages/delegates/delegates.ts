import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Delegate, Network, VoteType } from 'ark-ts';

import { Wallet, Transaction } from '@models/model';

import * as constants from '@app/app.constants';
import lodash from 'lodash';

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
  ) { }

  openDetailModal(delegate: Delegate) {
    let modal = this.modalCtrl.create('DelegateDetailPage', {
      delegate,
      vote: this.walletVote,
    }, { cssClass: 'inset-modal-large', showBackdrop: true, enableBackdropDismiss: true });

    modal.onDidDismiss((voter) => {
      if (!voter) return;

      this.getPassphrases().then((passphrases) => {
        if (!passphrases) return;

        let type = VoteType.Add;

        if (this.walletVote && this.walletVote.publicKey === voter.publicKey) type = VoteType.Remove;

        this.arkApiProvider.api.transaction.createVote({
          delegatePublicKey: voter.publicKey,
          passphrase: passphrases['passphrase'],
          secondPassphrase: passphrases['secondPassphrase'],
          type
        }).subscribe((transaction) => {
          this.confirmTransaction(transaction, passphrases);
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

  isSameDelegate(delegatePublicKey) {
    if (this.currentWallet && this.walletVote && this.walletVote.publicKey === delegatePublicKey) {
      return true;
    }

    return false;
  }

  private confirmTransaction(transaction: Transaction, passphrases: any) {
    let response = { status: false, message: undefined };
    transaction = new Transaction(this.currentWallet.address).deserialize(transaction);

    this.arkApiProvider.createTransaction(transaction, passphrases['passphrase'], passphrases['secondPassphrase'])
      .finally(() => {
        if (response.status) {
          let confirmModal = this.modalCtrl.create('TransactionConfirmPage', {
            transaction,
            passphrases,
            address: this.currentWallet.address,
          }, { cssClass: 'inset-modal', enableBackdropDismiss: true });

          confirmModal.onDidDismiss((result) => {
            if (lodash.isUndefined(result)) return;

            if (result.status) {
              return this.navCtrl.push('TransactionResponsePage', {
                transaction,
                passphrases,
                response: result,
                wallet: this.currentWallet,
              });
            }

            response = result;
            this.presentTransactionResponseModal(response);
          });

          confirmModal.present();
        } else {
          this.presentTransactionResponseModal(response);
        }
      })
      .subscribe((tx) => {
        response.status = true;
        transaction = tx;
      }, (error) => {
        response.status = false,
        response.message = error;
      });
  }

  private presentTransactionResponseModal(response: any) {
    let responseModal = this.modalCtrl.create('TransactionResponsePage', {
      response
    }, { cssClass: 'inset-modal-small' });

    responseModal.present();
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
        // TODO: Toast error
      });
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

        let passphrases = this.userDataProvider.getPassphrasesByWallet(this.currentWallet, password);
        resolve(passphrases);
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

  ionViewDidEnter() {
    this.currentNetwork = this.arkApiProvider.network;
    this.currentWallet = this.userDataProvider.currentWallet;

    this.arkApiProvider.delegates.subscribe((data) => this.zone.run(() => this.delegates = data));

    this.onUpdateDelegates();
    this.getSupply();
    this.fetchCurrentVote();
    this.arkApiProvider.fetchAllDelegates().subscribe();

    this.refreshListener = setInterval(() => this.getSupply(), constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
