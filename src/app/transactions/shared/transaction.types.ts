import { SatoshiAmount } from "@/app/shared/shared.types";

export enum TransactionGroup {
	Standard = 1,
	Magistration = 2,
}

/** camelCase required for this enum */
export enum TransactionStandardType {
	transfer = 0,
	vote = 3,
}

export type TransactionType = TransactionStandardType;

export type TransactionFeeDynamic = {
	avg: SatoshiAmount;
	max: SatoshiAmount;
	min: SatoshiAmount;
};

export type TransactionFeeStatic = SatoshiAmount;

export type TransactionFee = Partial<
	TransactionFeeDynamic & { static: TransactionFeeStatic }
>;
