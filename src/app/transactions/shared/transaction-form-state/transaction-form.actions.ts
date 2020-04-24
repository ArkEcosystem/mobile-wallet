import { Transaction } from "../transaction.types";

export namespace TransactionFormActions {
	export class Start {
		static readonly type = "[TransactionForm] Start";
		constructor(public payload: Partial<Transaction>) {}
	}

	export class Update {
		static readonly type = "[TransactionForm] Update";
		constructor(public payload: Partial<Transaction>) {}
	}
}
