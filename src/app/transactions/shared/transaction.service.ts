import { Injectable } from "@angular/core";
import { TransactionType } from "ark-ts";
import { EMPTY, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";

import {
	TransactionFee,
	TransactionFeeDynamic,
	TransactionFeeStatic,
} from "./transaction.types";

@Injectable({ providedIn: "root" })
export class TransactionService {
	constructor() {}

	public getFeesByType(type: TransactionType): Observable<TransactionFee> {
		return this.getStaticFeeByType(type).pipe(
			concatMap((staticFee) =>
				this.getDynamicFeeByType(type).pipe(
					map((dynamic) => ({ static: staticFee, ...dynamic })),
				),
			),
		);
	}

	private getDynamicFeeByType(
		type: TransactionType,
	): Observable<TransactionFeeDynamic> {
		return EMPTY;
	}

	private getStaticFeeByType(
		type: TransactionType,
	): Observable<TransactionFeeStatic> {
		return EMPTY;
	}
}
