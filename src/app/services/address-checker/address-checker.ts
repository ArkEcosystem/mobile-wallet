import { Injectable } from '@angular/core';
import { NetworkProvider } from '@/services/network/network';
import { Observable, Subscriber } from 'rxjs';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import { NeoApiProvider } from '@/services/neo-api/neo-api';
import { CompleteHandler } from '../../utils/complete-handler';
import { AddressCheckResultType } from '@/services/address-checker/address-check-result-type';
import { AddressCheckResult } from '@/services/address-checker/address-check-result';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressCheckerProvider {

  public constructor(private networkProvider: NetworkProvider,
                     private userDataProvider: UserDataProvider,
                     private arkApiProvider: ArkApiProvider,
                     private neoApiProvider: NeoApiProvider) {
  }

  public checkAddress(address: string): Observable<AddressCheckResult> {
    return Observable.create((observer: Subscriber<AddressCheckResult>) => {
      const handler = new CompleteHandler<AddressCheckResult>(observer, 2);

      if (!this.isValidAddress(address)) {
        handler.complete(AddressCheckerProvider.createError('VALIDATION.INVALID_ADDRESS'));
        return;
      }

      if (this.isOwnAddress(address)) {
        handler.complete(AddressCheckerProvider.createWarning('VALIDATION.IS_OWN_ADDRESS'));
        return;
      }

      this.hasTransactions(address).subscribe(hasTxs => {
        if (hasTxs) {
          handler.complete();
        } else {
          handler.completeAsLast(AddressCheckerProvider.createWarning('VALIDATION.NO_TRANSACTIONS'));
        }
      }, () => handler.softComplete());

      this.neoApiProvider.doesAddressExist(address).subscribe(exists => {
        if (exists) {
          handler.complete(AddressCheckerProvider.createWarning('VALIDATION.IS_NEO_ADDRESS'));
        } else {
          handler.softComplete();
        }
      }, () => handler.softComplete());
    });
  }

  public isValidAddress(address: string): boolean {
    return this.networkProvider.isValidAddress(address);
  }

  public isOwnAddress(address: string): boolean {
    return this.userDataProvider.currentWallet.address === address;
  }

  public hasTransactions(address: string): Observable<boolean> {
    return this.arkApiProvider.client.getTransactionList(address).pipe(
      map(txs => {
        if (!txs.success) {
          throw Error();
        }
       return txs.transactions && txs.transactions.length > 0;
      })
    )
  }

  private static createError(key: string, parameters?: Object): AddressCheckResult {
    return AddressCheckerProvider.createReturnObjectType(AddressCheckResultType.Error, key, parameters);
  }

  private static createWarning(key: string, parameters?: Object): AddressCheckResult {
    return AddressCheckerProvider.createReturnObjectType(AddressCheckResultType.Warning, key, parameters);
  }

  private static createReturnObjectType(type: AddressCheckResultType, key: string, parameters?: Object): AddressCheckResult {
    return new AddressCheckResult(type, {key, parameters});
  }

}
