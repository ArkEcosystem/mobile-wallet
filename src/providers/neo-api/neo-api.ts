import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkProvider } from '@providers/network/network';
import { Observable } from 'rxjs/Observable';

interface NeoUnclaimedResult {
  unclaimed: any;
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

    // we use the getUnClaimed call, because it's fast, if the address exists (i.e. has any transactions), the address is returned
    // we check if it's a real address (and not "not found") and return the result
    return this.getUnClaimed(address)
      .map((r: NeoUnclaimedResult) => this.isValidAddress(r.address));
  }

  private getUnClaimed(address: string): Observable<NeoUnclaimedResult> {
    return this.http.get<NeoUnclaimedResult>(`${NeoApiProvider.baseUrl}/get_unclaimed/${address}`);
  }

  private isValidAddress(address): boolean {
    // since NEO addresses are the same as ARK addresses, we can use the ark validateAddress method ;)
    // however we have to "hardcode the version", since it's not "network dependant" (e.g. devNet has another version)
    return this.networkProvider.isValidAddress(address, 0x17);
  }
}
