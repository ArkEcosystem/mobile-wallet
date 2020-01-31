import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { Subject } from "rxjs";
import { first, tap } from "rxjs/operators";
import { AuthConfig } from "../auth.config";
import { AuthActions } from "./auth.actions";
import { AuthStateModel } from "./auth.type";

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.TOKEN,
);

@State({
	name: AUTH_STATE_TOKEN,
	defaults: {
		isPending: false,
		method: undefined,
	},
})
export class AuthState {
	public static subject = new Subject<void>();

	constructor() {}

	@Action(AuthActions.Request)
	public request(ctx: StateContext<AuthStateModel>) {
		ctx.patchState({
			isPending: true,
		});

		return AuthState.subject.pipe(
			first(),
			tap(() => {
				ctx.patchState({
					isPending: false,
					method: undefined,
				});
			}),
		);
	}

	@Action(AuthActions.SetMethod)
	public setMethod(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.SetMethod,
	) {
		ctx.patchState({
			method: action.method,
		});
	}
}
