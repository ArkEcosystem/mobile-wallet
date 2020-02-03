import {
	Action,
	NgxsOnInit,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthConfig } from "../auth.config";
import { AuthActions, AuthEvents } from "./auth.actions";
import { AuthService } from "./auth.service";
import { AuthStateModel } from "./auth.type";

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.TOKEN,
);

const defaultState: AuthStateModel = {
	attempts: 0,
	isPending: false,
	method: undefined,
};

@State({
	name: AUTH_STATE_TOKEN,
	defaults: defaultState,
})
export class AuthState implements NgxsOnInit {
	constructor(private authService: AuthService) {}

	public ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		this.authService.getAttempts().subscribe(attempts =>
			ctx.patchState({
				attempts,
			}),
		);
	}

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
		ctx.patchState(defaultState);
	}

	@Action(AuthActions.IncreaseAttempts)
	public increaseAttempts(
		ctx: StateContext<AuthStateModel>,
	): Observable<void> {
		const { attempts } = ctx.getState();
		const newAttempts = attempts + 1;
		return this.authService.setAttempts(newAttempts).pipe(
			tap(() =>
				ctx.patchState({
					attempts: newAttempts,
				}),
			),
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
