import { BigNumber } from "@/utils/bignumber";

import { TransactionFormModel } from "./transaction.types";

export function getTotalSpent(transaction: TransactionFormModel): BigNumber {
	return BigNumber.make(transaction.amount).plus(transaction.fee);
}
