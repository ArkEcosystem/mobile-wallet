import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";

import { Transaction } from "../transaction.types";
import { TransactionFormActions } from "./transaction-form.actions";

@State<Transaction>({
	name: "form",
})
@Injectable()
export class TransactionFormState {
	constructor() {}

	@Action(TransactionFormActions.Start)
	public start(
		ctx: StateContext<Transaction>,
		action: TransactionFormActions.Start,
	) {
		ctx.setState({
			amount: "0",
			asset: undefined,
			fee: "0",
			id: undefined,
			nonce: undefined,
			recipient: undefined,
			sender: undefined,
			signature: undefined,
			...action.payload,
		});
	}

	@Action(TransactionFormActions.Update)
	public update(
		ctx: StateContext<Transaction>,
		action: TransactionFormActions.Update,
	) {
		const state = ctx.getState();
		ctx.patchState({
			...action.payload,
			asset: {
				...state.asset,
				...action.payload.asset,
			},
		});
	}
}
