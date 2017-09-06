import { Transaction } from 'ark-ts/model';

export class Wallet {
  could: boolean;
  address: string;
  publicKey: string;
  transactions: Transaction[] = [];
  lastTransactionDate?: Date;
  lastUpdate?: Date;
}
