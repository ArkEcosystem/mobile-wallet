import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import { ModalController, NavController } from '@ionic/angular';
import { Wallet, WalletKeys, Transaction, TranslatableObject } from '@/models/model';
import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';
import { AddressCheckResult } from '@/services/address-checker/address-check-result';
import { ConfirmTransactionModal } from '@/app/modals/confirm-transaction/confirm-transaction';

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

  open(transaction: any, keys: WalletKeys, addressCheckResult?: AddressCheckResult, extra = {}) {
    transaction = new Transaction(this.wallet.address).deserialize(transaction);

    this.arkApiProvider.createTransaction(transaction, keys.key, keys.secondKey, keys.secondPassphrase)
      .subscribe(async (tx) => {
        const modal = await this.modalCtrl.create({
          component: ConfirmTransactionModal,
          componentProps: {
            transaction: tx,
            addressCheckResult: addressCheckResult,
            extra: extra
          },
          backdropDismiss: true
        });

        modal.onDidDismiss().then(({ data }) => {
          if (lodash.isUndefined(data)) {
            return this.onClosed.emit();
          }

          if (!data.status) {
            this.onClosed.emit();

            return this.presentWrongModal(data);
          }

          this.onConfirm.emit(tx);

          this.navCtrl.navigateForward('/transaction/response', {
            queryParams: {
              transaction: tx,
              keys,
              response: data,
              wallet: this.wallet,
            },
            replaceUrl: true
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

  async presentWrongModal(response) {
    // TODO:
    // const responseModal = await this.modalCtrl.create({
    //   component: TransactionResponsePage,
    //   componentProps: response
    // });

    // responseModal.present();
  }

}
