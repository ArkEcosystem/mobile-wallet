export class Profile {
  contacts: any = {};
  name: string;
  networkId: string;
  wallets: any = {};

  deserialize(input: any): Profile {
    this.reset();
    const self: any = this;

    for (const prop in input) {
      self[prop] = input[prop];
    }
    return self;
  }

  reset() {
    this.contacts = {};
    this.name = null;
    this.networkId = null;
    this.wallets = {};
  }
}

