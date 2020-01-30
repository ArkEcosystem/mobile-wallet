import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { first, tap } from "rxjs/operators";
import { PinConfig } from "../pin.config";
import { PinActions } from "./pin.actions";
import { PinStateModel } from "./pin.type";

export const PIN_STATE_TOKEN = new StateToken<PinStateModel>(PinConfig.TOKEN);

@State<PinStateModel>({
	name: PIN_STATE_TOKEN,
	defaults: {
		isOpen: false,
	},
})
export class PinState {
	static subject = new Subject<void>();

	@Selector()
	static isOpen(state: PinStateModel): boolean {
		return state.isOpen;
	}

	constructor() {}

	@Action(PinActions.Request)
	public request(ctx: StateContext<PinStateModel>): Observable<void> {
		ctx.patchState({
			isOpen: true,
		});

		return PinState.subject.pipe(
			first(),
			tap(() => {
				ctx.patchState({
					isOpen: false,
				});
			}),
		);
	}
}
