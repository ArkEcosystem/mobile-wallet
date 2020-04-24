import { Pipe, PipeTransform } from "@angular/core";

import { Transaction, TransactionOperation } from "./transaction.types";
import { getTotalSpent } from "./transaction.utils";

@Pipe({
	name: "transaction",
})
export class TransactionPipe implements PipeTransform {
	transform(input: Transaction | TransactionOperation): any {
		const totalSpent = getTotalSpent(input);

		return {
			...input,
			totalSpent,
		};
	}
}
