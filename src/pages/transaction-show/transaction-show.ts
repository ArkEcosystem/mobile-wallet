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

  constructor(public navCtrl: NavController, public navParams: NavParams, private _userDataProvider: UserDataProvider) {
    this.transaction = this.navParams.get('transaction');
    this.networkSymbol = this.navParams.get('symbol');
    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!this.transaction || !this.networkSymbol) this.navCtrl.popToRoot();

    let walletRecipient = this._userDataProvider.walletGet(this.transaction.recipientId);
    let walletSender = this._userDataProvider.walletGet(this.transaction.senderId);

    this.recipientLabel = walletRecipient ? walletRecipient.label : null;
    this.senderLabel = walletSender ? walletSender.label : null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionShowPage');
  }

}
