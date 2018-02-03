import { Transaction as TransactionModel, TransactionType } from 'ark-ts/model';
import arkConfig from 'ark-ts/config';

import { MarketCurrency, MarketHistory, MarketTicker } from '@models/market';

import { UnitsSatoshiPipe } from '@pipes/units-satoshi/units-satoshi';

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

  constructor(public address: string) {
    super();
  }

  deserialize(input: any): Transaction {
    const self: any = this;

    for (const prop in input) {
      self[prop] = input[prop];
    }

    this.date = new Date(this.getTimestamp() * 1000);

    return self;
  }

  getAmount() {
    let amount = this.amount;

    if (this.isSender()) { amount = this.amount + this.fee; }

    return amount;
  }

  getAmountEquivalent(marketCurrency: MarketCurrency, market: MarketTicker | MarketHistory): number {
    if (!market || !marketCurrency) { return 0; }

    let price = 0;
    if (market instanceof MarketTicker) {
      const currency = market ? market.getCurrency({ code: marketCurrency.code }) : null;
      price = currency ? currency.price : 0;
    } else {
      price = market.getPriceByDate(marketCurrency.code, this.date);
    }

    const unitsSatoshiPipe = new UnitsSatoshiPipe();
    const amount = unitsSatoshiPipe.transform(this.getAmount(), true);

    return amount * price;
  }

  getTimestamp() {
    const blockchainDate = arkConfig.blockchain.date;
    const blockchainTime = blockchainDate.getTime() / 1000;

    return this.timestamp + blockchainTime;
  }

  getAppropriateAddress() {
    if (this.isTransfer()) {
      if (this.isSender()) {
        return this.recipientId;
      } else if (this.isReceiver()) {
        return this.senderId;
      }
    }
  }

  getTypeLabel(): string {
    let type = TX_TYPES[this.type];

    if (this.isTransfer() && !this.isSender()) { type = 'TRANSACTIONS_PAGE.RECEIVED'; }

    return type;
  }

  getActivityLabel() {
    let type = TX_TYPES_ACTIVITY[this.type];

    if (this.isTransfer() && !this.isSender()) { type = 'TRANSACTIONS_PAGE.RECEIVED_FROM'; }

    return type;
  }

  isTransfer(): boolean {
    return this.type === TransactionType.SendArk;
  }

  isSender(): boolean {
    return this.senderId === this.address;
  }

  isReceiver(): boolean {
    return this.recipientId === this.address;
  }

}
