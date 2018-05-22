import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NetworkProvider } from '@providers/network/network';

@Injectable()
export class AddressValidator {

  public constructor(private networkProvider: NetworkProvider) {}

  public isValid(control: FormControl): any {
    if (!control.value) { return null; }

    if (!this.networkProvider.isValidAddress(control.value)) {
      return { 'invalidAddress': true };
    }

    return null;
  }

}
