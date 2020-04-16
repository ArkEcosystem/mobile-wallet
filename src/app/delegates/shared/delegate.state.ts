import { Injectable } from "@angular/core";
import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { produce } from "immer";
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

	@Action(DelegateActions.Refresh)
	public refresh(
		ctx: StateContext<DelegateStateModel>,
		action: DelegateActions.Refresh,
	) {
		return this.delegateService.getDelegates(action.payload).pipe(
			tap((delegates) => {
				ctx.setState(
					produce((draft) => {
						draft.delegates.concat(delegates);
					}),
				);
			}),
		);
	}

	@Action(DelegateActions.Clear)
	public clear(ctx: StateContext<DelegateStateModel>) {
		return ctx.setState(defaults);
	}
}
