import { SatoshiAmount } from "@/app/shared/shared.types";

export enum TransactionType {
	Transfer = "transfer",
	Vote = "vote",
}

export enum TransactionVoteType {
	Vote = "vote",
	Unvote = "unvote",
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
