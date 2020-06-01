import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { SatoshiAmount } from "@/app/shared/shared.types";

import { Transaction, TransactionOperation } from "./transaction.types";

export function getTotalSpent(
	transaction: TransactionOperation | Transaction,
): SatoshiAmount {
	return BigNumber.make(transaction.amount).plus(transaction.fee).toString();
}
