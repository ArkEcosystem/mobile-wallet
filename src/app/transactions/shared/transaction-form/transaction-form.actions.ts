import { TransactionGroup } from "../transaction.types";
import { TransactionFormModel } from "../transaction.types";

export namespace TransactionFormActions {
	export class Start {
		static readonly type = "[TransactionForm] Start";
		constructor(
			public payload: {
				type: number;
				typeGroup: TransactionGroup;
			},
		) {}
	}

	export class Update {
		static readonly type = "[TransactionForm] Update";
		constructor(public payload: Partial<TransactionFormModel>) {}
	}

	export class GetNonce {
		static readonly type = "[TransactionForm] Get Nonce";
		constructor() {}
	}
}
