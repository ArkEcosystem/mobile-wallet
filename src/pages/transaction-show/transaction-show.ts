import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Transaction } from '@models/transaction';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.transaction = this.navParams.get('transaction');
    this.networkSymbol = this.navParams.get('symbol');
    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!this.transaction || !this.networkSymbol) this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionShowPage');
  }

}
