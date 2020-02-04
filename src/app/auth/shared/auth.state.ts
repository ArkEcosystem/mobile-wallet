import { VOID } from "@/app/core/operators";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { Observable } from "rxjs";
import { switchMapTo, tap } from "rxjs/operators";
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
	unlockDate: undefined,
};

@State({
	name: AUTH_STATE_TOKEN,
	defaults: defaultState,
})
export class AuthState implements NgxsOnInit {
	@Selector()
	static isBlocked(state: AuthStateModel): boolean {
		return !!state.unlockDate;
	}

	constructor(private authService: AuthService) {}

	public ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		this.authService.load().subscribe(data =>
			ctx.patchState({
				attempts: data.attempts,
				unlockDate: data.unlockDate,
			}),
		);
	}

	@Action(AuthActions.Authorize)
	public authorize(ctx: StateContext<AuthStateModel>): Observable<void> {
		return this.authService
			.reset()
			.pipe(
				switchMapTo(
					ctx.dispatch([AuthActions.Dismiss, AuthEvents.Authorized]),
				),
			);
	}

	@Action(AuthActions.Deny)
	public deny(ctx: StateContext<AuthStateModel>): Observable<void> {
		return ctx.dispatch([AuthActions.Dismiss, AuthEvents.Denied]);
	}

	@Action(AuthActions.Request)
	public request(ctx: StateContext<AuthStateModel>): void {
		ctx.patchState({
			isPending: true,
		});
	}

	@Action(AuthActions.Dismiss)
	public dismiss(ctx: StateContext<AuthStateModel>): void {
		ctx.setState(defaultState);
	}

	@Action(AuthActions.IncreaseAttempts)
	public increaseAttempts(
		ctx: StateContext<AuthStateModel>,
	): Observable<void> {
		const { attempts } = ctx.getState();
		const newAttempts = attempts + 1;

		return this.authService.increaseAttempts(newAttempts).pipe(
			tap(data =>
				ctx.patchState({
					attempts: data.attempts,
					unlockDate: data.unlockDate,
				}),
			),
			switchMapTo(VOID),
		);
	}

	@Action(AuthActions.SetMethod)
	public setMethod(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.SetMethod,
	): void {
		ctx.patchState({
			method: action.method,
		});
	}
}
