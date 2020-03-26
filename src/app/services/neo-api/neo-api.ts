import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { NetworkProvider } from "@/services/network/network";

@Injectable({ providedIn: "root" })
export class NeoApiProvider {
	private static readonly baseUrl = "https://neoscan.io/api/main_net/v1";

	public constructor(
		private http: HttpClient,
		private networkProvider: NetworkProvider,
	) {}

	public doesAddressExist(address): Observable<boolean> {
		if (!this.isValidAddress(address)) {
			return of(false);
		}

		// we use the getBalance call, because it's fast, if the address exists (i.e. has any transactions), the address is returned
		// we check if it's a real address (and not "not found") and return the result
		return this.getBalance(address).pipe(map((res) => res.length > 0));
	}

	private getBalance(address: string): Observable<any[]> {
		return this.http.get<any[]>(
			`${NeoApiProvider.baseUrl}/get_last_transactions_by_address/${address}`,
		);
	}

	private isValidAddress(address): boolean {
		// since NEO addresses are the same as ARK addresses, we can use the ark validateAddress method ;)
		// however we have to "hardcode the version", since it's not "network dependant" (e.g. devNet has another version)
		return this.networkProvider.isValidAddress(address, 0x17);
	}
}
