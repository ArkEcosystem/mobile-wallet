import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkProvider } from '@providers/network/network';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NeoApiProvider {
  private static readonly baseUrl = 'https://neoscan.io/api/main_net/v1';

  public constructor(private http: HttpClient, private networkProvider: NetworkProvider) {
  }

  public doesAddressExist(address): Observable<boolean> {
    if (!this.isValidAddress(address)) {
      return Observable.of(false);
    }

    // we use the getBalance call, because it's fast, if the address exists (i.e. has any transactions), the address is returned
    // we check if it's a real address (and not "not found") and return the result
    return this.getBalance(address).map(res => res.length > 0);
  }

  private getBalance(address: string): Observable<Object[]> {
    return this.http.get<Object[]>(`${NeoApiProvider.baseUrl}/get_last_transactions_by_address/${address}`);
  }

  private isValidAddress(address): boolean {
    // since NEO addresses are the same as ARK addresses, we can use the ark validateAddress method ;)
    // however we have to "hardcode the version", since it's not "network dependant" (e.g. devNet has another version)
    return this.networkProvider.isValidAddress(address, 0x17);
  }
}
