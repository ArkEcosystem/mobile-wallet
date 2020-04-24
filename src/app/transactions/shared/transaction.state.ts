import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";

import { TransactionFormState } from "./transaction-form-state/transaction-form.state";

@State({
	name: "transaction",
	children: [TransactionFormState],
})
@Injectable()
export class TransactionState {
	constructor() {}
}
