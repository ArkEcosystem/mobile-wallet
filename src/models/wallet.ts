import { Transaction, Account } from 'ark-ts/model';
import * as constants from '@app/app.constants';
import { MarketCurrency } from '@models/market';

export class Wallet extends Account {
  label?: string;
  transactions?: Transaction[];
  lastUpdate?: number;

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
    this.transactions = [];
    this.lastUpdate = null;
  }

  getBalance() {
    return Number(this.balance) / constants.WALLET_UNIT_TO_SATOSHI;
  }

  getBalanceEquivalent(currency: MarketCurrency) {
    let balance = this.getBalance() || 0;
    let price = currency ? currency.price : 0;
    let totalAmount = balance * price;

    return totalAmount.toFixed(2);
  }

}
