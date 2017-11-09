import { Account } from 'ark-ts/model';

import { MarketCurrency } from '@models/market';
import { Transaction } from '@models/transaction';

import * as constants from '@app/app.constants';

import { PublicKey } from 'ark-ts';

export class Wallet extends Account {
  username: string;
  isDelegate: boolean;
  label?: string;
  transactions?: Transaction[];
  lastUpdate?: number;
  cipherPassphrase?: any;
  cipherSecondPassphrase?: any;

  constructor() {
    super();
    this.reset();
  }

  deserialize(input: any): Wallet {
    let self: any = this;

    for (let prop in input) {
      self[prop] = input[prop];
    }
    return self;
  }

  reset() {
    this.label = null;
    this.balance = "0";
    this.isDelegate =  false;
    this.username = null;
    this.transactions = [];
    this.lastUpdate = null;
    this.cipherPassphrase = null;
    this.cipherSecondPassphrase = null;
  }

  loadTransactions(transactions: any) {
    if (!Array.isArray(transactions)) return;

    this.transactions = [];

    for (let tx of transactions) {
      let transaction = new Transaction(this.address);
      transaction.deserialize(tx);

      this.transactions.push(transaction);
    }
  }

  getBalance() {
    return Number(this.balance) / constants.WALLET_UNIT_TO_SATOSHI;
  }

  getBalanceEquivalent(currency: MarketCurrency) {
    let balance = this.getBalance() || 0;
    let price = currency ? currency.price : 0;
    let totalAmount = balance * price;

    return totalAmount;
  }

}
