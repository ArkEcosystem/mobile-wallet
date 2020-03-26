import { Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

import { AddressCheckResult } from "@/services/address-checker/address-check-result";
import { AddressCheckResultType } from "@/services/address-checker/address-check-result-type";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NeoApiProvider } from "@/services/neo-api/neo-api";
import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { CompleteHandler } from "../../utils/complete-handler";

@Injectable({ providedIn: "root" })
export class AddressCheckerProvider {
	public constructor(
		private networkProvider: NetworkProvider,
		private userDataService: UserDataService,
		private arkApiProvider: ArkApiProvider,
		private neoApiProvider: NeoApiProvider,
	) {}

	private static createError(
		key: string,
		parameters?: any,
	): AddressCheckResult {
		return AddressCheckerProvider.createReturnObjectType(
			AddressCheckResultType.Error,
			key,
			parameters,
		);
	}

	private static createWarning(
		key: string,
		parameters?: any,
	): AddressCheckResult {
		return AddressCheckerProvider.createReturnObjectType(
			AddressCheckResultType.Warning,
			key,
			parameters,
		);
	}

	private static createReturnObjectType(
		type: AddressCheckResultType,
		key: string,
		parameters?: any,
	): AddressCheckResult {
		return new AddressCheckResult(type, { key, parameters });
	}

	public checkAddress(address: string): Observable<AddressCheckResult> {
		return new Observable((observer: Subscriber<AddressCheckResult>) => {
			const handler = new CompleteHandler<AddressCheckResult>(
				observer,
				2,
			);

			if (!this.isValidAddress(address)) {
				handler.complete(
					AddressCheckerProvider.createError(
						"VALIDATION.INVALID_ADDRESS",
					),
				);
				return;
			}

			if (this.isOwnAddress(address)) {
				handler.complete(
					AddressCheckerProvider.createWarning(
						"VALIDATION.IS_OWN_ADDRESS",
					),
				);
				return;
			}

			this.hasTransactions(address).subscribe(
				(hasTxs) => {
					if (hasTxs) {
						handler.complete();
					} else {
						handler.completeAsLast(
							AddressCheckerProvider.createWarning(
								"VALIDATION.NO_TRANSACTIONS",
							),
						);
					}
				},
				() => handler.softComplete(),
			);

			this.neoApiProvider.doesAddressExist(address).subscribe(
				(exists) => {
					if (exists) {
						handler.complete(
							AddressCheckerProvider.createWarning(
								"VALIDATION.IS_NEO_ADDRESS",
							),
						);
					} else {
						handler.softComplete();
					}
				},
				() => handler.softComplete(),
			);
		});
	}

	public isValidAddress(address: string): boolean {
		return this.networkProvider.isValidAddress(address);
	}

	public isOwnAddress(address: string): boolean {
		return this.userDataService.currentWallet.address === address;
	}

	public hasTransactions(address: string): Observable<boolean> {
		return this.arkApiProvider.client
			.getTransactionList(address)
			.pipe(map((txs) => txs?.transactions?.length > 0));
	}
}
