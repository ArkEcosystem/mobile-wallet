import { SatoshiAmount } from "@/app/shared/shared.types";

export enum TransactionGroup {
	CORE = 1,
	MAGISTRATE = 2,
}

export enum TransactionTypeCore {
	TRANSFER = 0,
	VOTE = 3,
}

export type TransactionFeeDynamic = {
	avg: SatoshiAmount;
	max: SatoshiAmount;
	min: SatoshiAmount;
};

export type TransactionFeeStatic = SatoshiAmount;

export type TransactionFee = Partial<
	TransactionFeeDynamic & { static: TransactionFeeStatic }
>;

export interface TransactionFormModel {
	type: number;
	typeGroup: number;
	amount: SatoshiAmount;
	fee: SatoshiAmount;
	nonce: string;
	recipient: string;
	sender: string;
	asset?: {
		votes?: string[];
	};
	meta?: {
		username?: string;
	};
}
