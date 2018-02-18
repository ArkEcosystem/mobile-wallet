import { UserDataProvider } from '@providers/user-data/user-data';
import { Injectable } from '@angular/core';
import { PublicKey } from 'ark-ts/core';

@Injectable()
export class NetworkProvider {

  public constructor(private userDataProvider: UserDataProvider) {
  }

  public isValidAddress(address: string): boolean {
    return address
           && this.userDataProvider.currentNetwork
           && PublicKey.validateAddress(address, this.userDataProvider.currentNetwork);
  }
}
