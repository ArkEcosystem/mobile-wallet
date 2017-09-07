import { Transaction } from 'ark-ts/model';
import { Account } from 'ark-ts/model';

export class Wallet extends Account {
  label?: string;
  transactions?: Transaction[];
  lastTransactionDate?: Date;
  lastUpdate?: Date;

  constructor() {
    super();
  }

  deserialize(input: any): Wallet {
    this.reset();
    let self: any = this;

    for (let prop in input) {
      self[prop] = input[prop];
    }
    return self;
  }

  reset() {
    this.label = null;
    this.transactions = [];
    this.lastTransactionDate = null;
    this.lastUpdate = null;
  }
}
