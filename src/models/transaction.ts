import { Transaction as TransactionModel, TransactionType } from 'ark-ts/model';
import arkConfig from 'ark-ts/config';

import { MarketCurrency, MarketHistory, MarketTicker } from '@models/market';

const TX_TYPES = {
  0: 'TRANSACTIONS_PAGE.SENT',
  1: 'TRANSACTIONS_PAGE.SECOND_SIGNATURE_CREATION',
  2: 'TRANSACTIONS_PAGE.DELEGATE_REGISTRATION',
  3: 'DELEGATES_PAGE.VOTE',
  4: 'TRANSACTIONS.MULTISIGNATURE_CREATION',
};

const TX_TYPES_ACTIVITY = {
  0: 'TRANSACTIONS_PAGE.SENT_TO',
  1: 'TRANSACTIONS_PAGE.SECOND_SIGNATURE_CREATION',
  2: 'TRANSACTIONS_PAGE.DELEGATE_REGISTRATION',
  3: 'DELEGATES_PAGE.VOTE',
  4: 'TRANSACTIONS.MULTISIGNATURE_CREATION',
};

export interface SendTransactionForm {
  amount?: number;
  amountEquivalent?: number;
  recipientAddress?: string;
  recipientName?: string;
  smartBridge?: string;
}

export class Transaction extends TransactionModel {

  public date: Date;
  public totalAmount: number;

  constructor(public address: string) {
    super();
  }

  deserialize(input: any): Transaction {
    let self: any = this;

    for (let prop in input) {
      self[prop] = input[prop];
    }

    this.date = new Date(this.getTimestamp() * 1000);

    return self;
  }

  getAmount() {
    let amount = this.amount;

    if (this.isSender()) amount = this.amount + this.fee;

    return amount;
  }

  getAmountEquivalent(marketCurrency: MarketCurrency, market: MarketTicker | MarketHistory): number {
    if (!market || !marketCurrency) return 0;

    let price = 0;
    if (market instanceof MarketTicker) {
      let currency = market ? market.getCurrency({ code: marketCurrency.code }) : null;
      price = currency ? currency.price : 0;
    } else {
      price = market.getPriceByDate(marketCurrency.code, this.date);
    }

    return this.getAmount() * price;
  }

  getTimestamp() {
    var blockchainDate = arkConfig.blockchain.date;
    var blockchainTime = blockchainDate.getTime() / 1000;

    let currentTimestamp = this.timestamp + blockchainTime;

    return currentTimestamp;
  }

  getAppropriateAddress() {
    if (this.isTransfer()) {
      if (this.isSender()) {
        return this.recipientId;
      } else if (this.isReceiver(this.address)) {
        return this.senderId;
      }
    }
  }

  getTypeLabel(): string {
    let type = TX_TYPES[this.type];

    if (this.isTransfer() && !this.isSender()) type = 'TRANSACTIONS_PAGE.RECEIVED';

    return type;
  }

  getActivityLabel() {
    let type = TX_TYPES_ACTIVITY[this.type];

    if (this.isTransfer() && !this.isSender()) type = 'TRANSACTIONS_PAGE.RECEIVED_FROM';

    return type;
  }

  isTransfer(): boolean {
    return this.type == TransactionType.SendArk;
  }

  isSameAddress(): boolean {
    return this.senderId == this.recipientId;
  }

  isSender(): boolean {
    return this.senderId == this.address;
  }

  isReceiver(address: string): boolean {
    return this.recipientId == this.address;
  }

}
