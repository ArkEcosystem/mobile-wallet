import { Transaction, Account } from 'ark-ts/model';
import * as constants from '@app/app.constants';

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
}
