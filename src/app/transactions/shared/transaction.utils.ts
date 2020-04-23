import { SatoshiAmount } from "@/app/shared/shared.types";
import { BigNumber } from "@/utils/bignumber";

import { Transaction } from "./transaction.types";

export function getTotalSpent(transaction: Transaction): SatoshiAmount {
	return BigNumber.make(transaction.amount).plus(transaction.fee).toString();
}
