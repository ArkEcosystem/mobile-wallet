import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Transaction } from '@models/transaction';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Network } from 'ark-ts/model';

@IonicPage()
@Component({
  selector: 'page-transaction-show',
  templateUrl: 'transaction-show.html',
  providers: [InAppBrowser],
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
    private userDataProvider: UserDataProvider,
    private inAppBrowser: InAppBrowser,
  ) {
    let transaction = this.navParams.get('transaction');
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!transaction) this.navCtrl.popToRoot();

    this.transaction = new Transaction(transaction.address).deserialize(transaction);
  }

  openInExplorer() {
    let url = `${this.currentNetwork.explorer}/tx/${this.transaction.id}`;
    return this.inAppBrowser.create(url);
  }

}
