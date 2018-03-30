export interface AddressMap {
  index: string;
  key: string;
  value: string;
  highlight?: boolean;
}

export enum AutoCompleteAccountType {
  Wallet,
  Contact
}

export interface AutoCompleteAccount {
  address: string;
  name: string;
  iconName: string;
  type: AutoCompleteAccountType;
}

export interface Contact {
  address: string;
  name: string;
  description?: string;
}
