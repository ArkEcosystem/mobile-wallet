import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ModalController, NavController } from 'ionic-angular';
import { Wallet, WalletKeys, Transaction, TranslatableObject } from '@models/model';
import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';
import { AddressCheckResult } from '@providers/address-checker/address-check-result';

@Component({
  selector: 'confirm-transaction',
  templateUrl: 'confirm-transaction.html'
})
export class ConfirmTransactionComponent {

  @Input('wallet') wallet: Wallet;

  @Output('onClosed') onClosed: EventEmitter<string> = new EventEmitter();
  @Output('onError') onError: EventEmitter<string> = new EventEmitter();
  @Output('onConfirm') onConfirm: EventEmitter<Transaction> = new EventEmitter();

  constructor(
    private arkApiProvider: ArkApiProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private translateService: TranslateService
  ) { }

  open(transaction: any, keys: WalletKeys, addressCheckResult?: AddressCheckResult) {
    transaction = new Transaction(this.wallet.address).deserialize(transaction);

    this.arkApiProvider.createTransaction(transaction, keys.key, keys.secondKey, keys.secondPassphrase)
      .subscribe((tx) => {
        const modal = this.modalCtrl.create('ConfirmTransactionModal', {
          transaction: tx,
          addressCheckResult: addressCheckResult
        }, { cssClass: 'inset-modal-send', enableBackdropDismiss: true });

        modal.onDidDismiss((result) => {
          if (lodash.isUndefined(result)) {
            return this.onClosed.emit();
          }

          if (!result.status) {
            this.onClosed.emit();

            return this.presentWrongModal(result);
          }

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

        });

        modal.present();
      }, (error: TranslatableObject) => {
        this.translateService.get(error.key || (error as any).message || error as any, error.parameters)
          .subscribe((errorMessage) => {
            this.onError.emit(errorMessage);
            this.presentWrongModal({
              status: false,
              message: errorMessage
            });
          });
      });
  }

  presentWrongModal(response) {
    const responseModal = this.modalCtrl.create('TransactionResponsePage', {
      response
    }, { cssClass: 'inset-modal-small' });

    responseModal.present();
  }

}
