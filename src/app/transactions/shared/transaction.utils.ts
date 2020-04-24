import { SatoshiAmount } from "@/app/shared/shared.types";
import { BigNumber } from "@/utils/bignumber";

import { Transaction, TransactionOperation } from "./transaction.types";

export function getTotalSpent(
	transaction: TransactionOperation | Transaction,
): SatoshiAmount {
	return BigNumber.make(transaction.amount).plus(transaction.fee).toString();
}
