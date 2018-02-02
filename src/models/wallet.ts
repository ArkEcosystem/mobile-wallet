import { Account } from 'ark-ts/model';

import { MarketCurrency } from '@models/market';
import { Transaction } from '@models/transaction';

import * as constants from '@app/app.constants';

export interface QRCodeScheme {
  address?: string;
  amount?: string;
  label?: string;
  vendorField?: string;
  passphrase?: string;
}

export interface AccountBackup {
  address?: string;
  publicKey?: string;
  qrAddress?: string;
  mnemonic?: string;
  secondMnemonic?: string;
  entropy?: string;
  seed?: string;
  // bip38?: string;
  // secondBip38?: string;
  wif?: string;
}

export interface WalletKeys {
  key?: string;
  secondKey?: string;
  secondPassphrase?: string;
}

export class Wallet extends Account {
  username: string;
  isDelegate: boolean;
  label?: string;
  transactions?: Transaction[];
  lastUpdate?: number;
  cipherKey?: any;
  cipherSecondKey?: any;
  isWatchOnly?: boolean;
  iv?: any;
  isCold?: boolean;
  // bip38?: string;
  // secondBip38?: string;

  constructor(isWatchOnly?: boolean) {
    super();
    this.reset();
    if (isWatchOnly !== undefined) {
      this.isWatchOnly = isWatchOnly;
    }
  }

  deserialize(input: any): Wallet {
    const self: any = this;

    for (const prop in input) {
      self[prop] = input[prop];
    }
    return self;
  }

  reset() {
    this.label = null;
    this.balance = '0';
    this.isDelegate =  false;
    this.username = null;
    this.transactions = [];
    this.lastUpdate = null;
    this.cipherKey = null;
    this.cipherSecondKey = null;
    this.isWatchOnly = false;
    this.isCold = false;
  }

  loadTransactions(transactions: any) {
    if (!Array.isArray(transactions) || transactions.length <= 0) { return; }

    this.transactions = [];

    for (const tx of transactions) {
      const transaction = new Transaction(this.address);
      transaction.deserialize(tx);

      this.transactions.push(transaction);
    }
  }

  getBalance() {
    return Number(this.balance) / constants.WALLET_UNIT_TO_SATOSHI;
  }

  getBalanceEquivalent(currency: MarketCurrency) {
    const balance = this.getBalance() || 0;
    const price = currency ? currency.price : 0;

    return balance * price;
  }

}
