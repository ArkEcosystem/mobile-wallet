import { Wallet } from '@models/wallet';
import { Contact } from '@models/contact';

export class Profile {
  contacts: Contact[];
  name: string;
  networkId: string;
  wallets: Wallet[];

  reset() {
    this.contacts = [];
    this.name = null;
    this.networkId = null;
    this.wallets = [];
  }
}

