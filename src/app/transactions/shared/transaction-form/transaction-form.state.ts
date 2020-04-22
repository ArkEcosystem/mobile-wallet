import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";

import { SatoshiAmount } from "@/app/shared/shared.types";

import { TransactionType } from "../transaction.types";
import { TransactionFormActions } from "./transaction-form.actions";

export interface TransactionFormStateModel {
	type: TransactionType;
	typeGroup: number;
	amount: SatoshiAmount;
	fee: SatoshiAmount;
	nonce: string;
	recipient: string;
	sender: string;
	asset?: {
		votes?: string[];
	};
}

@State<TransactionFormStateModel>({
	name: "form",
})
@Injectable()
export class TransactionFormState {
	constructor() {}

	@Action(TransactionFormActions.Start)
	public start(
		ctx: StateContext<TransactionFormStateModel>,
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
		ctx: StateContext<TransactionFormStateModel>,
		action: TransactionFormActions.Update,
	) {
		ctx.patchState({
			...action.payload,
		});
	}
}
