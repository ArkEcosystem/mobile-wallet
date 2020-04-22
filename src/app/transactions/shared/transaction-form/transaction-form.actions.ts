import { TransactionGroup, TransactionType } from "../transaction.types";
import { TransactionFormStateModel } from "./transaction-form.state";

export namespace TransactionFormActions {
	export class Start {
		static readonly type = "[TransactionForm] Start";
		constructor(
			public payload: {
				type: TransactionType;
				typeGroup: TransactionGroup;
			},
		) {}
	}

	export class Update {
		static readonly type = "[TransactionForm] Update";
		constructor(public payload: Partial<TransactionFormStateModel>) {}
	}

	export class GetNonce {
		static readonly type = "[TransactionForm] Get Nonce";
		constructor() {}
	}
}
