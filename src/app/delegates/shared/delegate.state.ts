import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { tap } from "rxjs/operators";

import { DelegateActions } from "./delegate.actions";
import { DelegateConfig } from "./delegate.config";
import { DelegateService } from "./delegate.service";
import { Delegate } from "./delegate.types";

export interface DelegateStateModel {
	delegates: Delegate[];
	totalCount: number;
}

export const DELEGATE_STATE_TOKEN = new StateToken<DelegateStateModel>(
	DelegateConfig.KEY,
);

const defaults = {
	delegates: [],
	totalCount: 0,
};

@State<DelegateStateModel>({
	name: DelegateConfig.KEY,
	defaults,
})
@Injectable()
export class DelegateState {
	constructor(private delegateService: DelegateService) {}

	@Selector()
	public static delegates(state: DelegateStateModel) {
		return state.delegates;
	}

	@Action(DelegateActions.Fetch)
	public fetch(
		ctx: StateContext<DelegateStateModel>,
		action: DelegateActions.Fetch,
	) {
		return this.delegateService.getDelegates(action.payload).pipe(
			tap((delegates) => {
				const state = ctx.getState();
				ctx.patchState({
					// TODO: Total count
					delegates: [...state.delegates, ...delegates],
				});
			}),
		);
	}

	@Action(DelegateActions.Clear)
	public clear(ctx: StateContext<DelegateStateModel>) {
		return ctx.setState(defaults);
	}
}
