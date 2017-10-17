import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Transaction } from '@models/transaction';
import { UserDataProvider } from '@providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-transaction-show',
  templateUrl: 'transaction-show.html',
})
export class TransactionShowPage {

  public transaction: Transaction;
  public networkSymbol: string;
  public equivalentAmount: number = 0;
  public equivalentSymbol: string;

  public recipientLabel: string;
  public senderLabel: string;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider
  ) {
    this.transaction = this._navParams.get('transaction');
    this.networkSymbol = this._navParams.get('symbol');
    this.equivalentAmount = this._navParams.get('equivalentAmount');
    this.equivalentSymbol = this._navParams.get('equivalentSymbol');

    if (!this.transaction || !this.networkSymbol) this._navCtrl.popToRoot();

    let walletRecipient = this._userDataProvider.walletGet(this.transaction.recipientId);
    let walletSender = this._userDataProvider.walletGet(this.transaction.senderId);

    this.recipientLabel = walletRecipient ? walletRecipient.label : null;
    this.senderLabel = walletSender ? walletSender.label : null;
  }

}
