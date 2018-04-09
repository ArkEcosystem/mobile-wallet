import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkProvider } from '@providers/network/network';
import { Observable } from 'rxjs/Observable';

interface BalanceResult {
  unclaimed: any;
  balance: any;
  address: string;
}

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
    return this.getBalance(address)
      .map((r: BalanceResult) => this.isValidAddress(r.address));
  }

  private getBalance(address: string): Observable<BalanceResult> {
    return this.http.get<BalanceResult>(`${NeoApiProvider.baseUrl}/get_balance/${address}`);
  }

  private isValidAddress(address): boolean {
    // since NEO addresses are the same as ARK addresses, we can use the ark validateAddress method ;)
    // however we have to "hardcode the version", since it's not "network dependant" (e.g. devNet has another version)
    return this.networkProvider.isValidAddress(address, 0x17);
  }
}
