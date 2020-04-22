import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";

import { TransactionFormModel } from "../transaction.types";
import { TransactionFormActions } from "./transaction-form.actions";

@State<TransactionFormModel>({
	name: "form",
})
@Injectable()
export class TransactionFormState {
	constructor() {}

	@Action(TransactionFormActions.Start)
	public start(
		ctx: StateContext<TransactionFormModel>,
		action: TransactionFormActions.Start,
	) {
		ctx.setState({
			amount: "0",
			fee: "0",
			nonce: "1",
			recipient: undefined,
			sender: undefined,
			...action.payload,
		});
	}

	@Action(TransactionFormActions.Update)
	public update(
		ctx: StateContext<TransactionFormModel>,
		action: TransactionFormActions.Update,
	) {
		ctx.patchState({
			...action.payload,
		});
	}
}
