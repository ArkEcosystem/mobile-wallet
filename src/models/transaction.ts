import { Transaction as TransactionModel, TransactionType } from 'ark-ts/model';

const TX_TYPES = {
  0: 'Send Ark',
  1: 'Second Signature Creation',
  2: 'Delegate Registration',
  3: 'Vote',
  4: 'Multisignature Creation',
};

export class Transaction extends TransactionModel {

  constructor() {
    super();
  }

  deserialize(input: any): Transaction {
    let self: any = this;

    for (let prop in input) {
      self[prop] = input[prop];
    }

    return self;
  }

  getTypeLabel() {
    return TX_TYPES[this.type];
  }

  isTransfer() {
    return this.type == TransactionType.SendArk;
  }

  isSameAddress() {
    return this.senderId == this.recipientId;
  }

}
