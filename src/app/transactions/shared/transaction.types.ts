import { SatoshiAmount } from "@/app/shared/shared.types";

export enum TransactionMode {
	IN = "in",
	OUT = "out",
}

export interface Transaction {
	amount: SatoshiAmount;
	asset?: {
		votes?: string[];
		payments?: {
			amount: string;
			recipient: string;
		}[];
		vendorField?: string;
	};
	fee: SatoshiAmount;
	id: string;
	nonce: string;
	recipient: string;
	sender: string;
	signature: string;
}

export type TransactionOperation = Transaction & {
	address: string;
	blockHeight: string;
	blockId: string;
	confirmations: string;
	date: string;
	mode: TransactionMode;
};
