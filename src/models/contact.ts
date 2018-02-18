export interface AddressMap {
  index: string;
  key: string;
  value: string;
  highlight?: boolean;
}

export interface AutoCompleteContact {
  address: string;
  name: string;
  iconName: string;
}

export interface Contact {
  address: string;
  name: string;
  description?: string;
}
