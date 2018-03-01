import { UserDataProvider } from '@providers/user-data/user-data';
import { Injectable } from '@angular/core';
import { PublicKey } from 'ark-ts/core';
import { Network } from 'ark-ts';

@Injectable()
export class NetworkProvider {

  public get currentNetwork(): Network {
    return this.userDataProvider.currentNetwork;
  }

  public constructor(private userDataProvider: UserDataProvider) {
  }

  public isValidAddress(address: string): boolean {
    return address
           && this.currentNetwork
           && PublicKey.validateAddress(address, this.userDataProvider.currentNetwork);
  }
}
