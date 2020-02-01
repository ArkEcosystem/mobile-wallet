import { Action, State, StateContext, StateToken } from "@ngxs/store";
import { AuthConfig } from "../auth.config";
import { AuthActions, AuthEvents } from "./auth.actions";
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
	constructor() {}

	@Action(AuthActions.Authorize)
	public authorize(ctx: StateContext<AuthStateModel>) {
		return ctx.dispatch([AuthActions.Dismiss, AuthEvents.Authorized]);
	}

	@Action(AuthActions.Deny)
	public deny(ctx: StateContext<AuthStateModel>) {
		return ctx.dispatch([AuthActions.Dismiss, AuthEvents.Denied]);
	}

	@Action(AuthActions.Request)
	public request(ctx: StateContext<AuthStateModel>) {
		ctx.patchState({
			isPending: true,
		});
	}

	@Action(AuthActions.Dismiss)
	public dismiss(ctx: StateContext<AuthStateModel>) {
		ctx.patchState({
			isPending: false,
			method: undefined,
		});
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
