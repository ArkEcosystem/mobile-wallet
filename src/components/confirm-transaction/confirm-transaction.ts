import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ModalController, NavController } from 'ionic-angular';
import { Wallet, WalletKeys, Transaction } from '@models/model';

import lodash from 'lodash';

@Component({
  selector: 'confirm-transaction',
  templateUrl: 'confirm-transaction.html'
})
export class ConfirmTransactionComponent {

  @Input('wallet') wallet: Wallet;

  @Output('onError') onError: EventEmitter<string> = new EventEmitter();
  @Output('onConfirm') onConfirm: EventEmitter<Transaction> = new EventEmitter();

  constructor(
    private arkApiProvider: ArkApiProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) { }

  open(transaction: any, keys: WalletKeys) {
    transaction = new Transaction(this.wallet.address).deserialize(transaction);

    this.arkApiProvider.createTransaction(transaction, keys.key, keys.secondKey, keys.secondPassphrase)
      .subscribe((tx) => {
        let modal = this.modalCtrl.create('ConfirmTransactionModal', {
          transaction: tx
        }, { cssClass: 'inset-modal', enableBackdropDismiss: true });

        modal.onDidDismiss((result) => {
          if (lodash.isUndefined(result)) return;

          if (!result.status) return this.presentWrongModal(result);

          this.onConfirm.emit(tx);

          return this.navCtrl.push('TransactionResponsePage', {
            transaction: tx,
            keys,
            response: result,
            wallet: this.wallet,
          })
          .then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
          });

        })

        modal.present();
      }, (error) => {
        this.onError.emit(error);
        this.presentWrongModal({
          status: false,
          message: error
        })
      });
  }

  presentWrongModal(response) {
    let responseModal = this.modalCtrl.create('TransactionResponsePage', {
      response
    }, { cssClass: 'inset-modal-small' });

    responseModal.present();
  }

}
