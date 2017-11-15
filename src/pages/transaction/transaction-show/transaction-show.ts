import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Transaction } from '@models/transaction';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Network } from 'ark-ts/model';

@IonicPage()
@Component({
  selector: 'page-transaction-show',
  templateUrl: 'transaction-show.html',
})
export class TransactionShowPage {

  public transaction: Transaction;
  public currentNetwork: Network;
  public equivalentAmount: number = 0;
  public equivalentSymbol: string;

  public recipientLabel: string;
  public senderLabel: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider
  ) {
    this.transaction = this.navParams.get('transaction');
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!this.transaction) this.navCtrl.popToRoot();

    let walletRecipient = this.userDataProvider.getWalletByAddress(this.transaction.recipientId);
    let walletSender = this.userDataProvider.getWalletByAddress(this.transaction.senderId);

    this.recipientLabel = walletRecipient ? walletRecipient.label : null;
    this.senderLabel = walletSender ? walletSender.label : null;
  }

}
