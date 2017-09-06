import { Wallet } from '@models/wallet';
import { Contact } from '@models/contact';

export class Profile {
  contacts: Contact[];
  name: string;
  wallets: Wallet[];
  loaded: boolean = false;

  reset() {
    this.contacts = [];
    this.name = null;
    this.wallets = [];
    this.loaded = false;
  }
}

