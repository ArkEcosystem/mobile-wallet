import { Injectable } from "@angular/core";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { throwError } from "rxjs";
import { catchError, first, map, switchMap, tap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthConfig, AuthMethod, AuthMode } from "./auth.config";
import { AuthService } from "./auth.service";

export interface AuthStateModel {
	attempts: number;
	method: AuthMethod;
	registerPasswordHash?: string;
	passwordHash?: string;
	unlockDate?: Date;
	mode?: AuthMode;
}

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.STORAGE_KEY,
);

@State<AuthStateModel>({
	name: AuthConfig.STORAGE_KEY,
	defaults: {
		attempts: 0,
		method: AuthMethod.Pin,
	},
})
@Injectable()
export class AuthState implements NgxsOnInit {
	constructor(private authService: AuthService) {}

	@Selector()
	public static hasMasterPassword(state: AuthStateModel) {
		return !!state.passwordHash;
	}

	@Selector()
	public static mode(state: AuthStateModel) {
		return state.mode;
	}

	ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		const state = ctx.getState();

		this.authService
			.getPasswordHash()
			.pipe(
				first(),
				map((hash) => {
					if (hash) {
						ctx.patchState({
							passwordHash: hash,
						});
					}
				}),
			)
			.subscribe();

		if (this.authService.hasUnlockDateExpired(state.unlockDate)) {
			ctx.patchState({
				unlockDate: undefined,
			});
		}
	}

	@Action(AuthActions.Open)
	public open(
		ctx: StateContext<AuthStateModel>,
		{ payload }: AuthActions.Open,
	) {
		return ctx.patchState({
			mode: payload.mode,
			...(payload.method && { method: payload.method }),
		});
	}

	@Action(AuthActions.Cancel)
	public cancel(ctx: StateContext<AuthStateModel>) {
		return ctx.patchState({
			mode: undefined,
			registerPasswordHash: undefined,
		});
	}

	@Action(AuthActions.ValidatePassword)
	public validatePassword(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.ValidatePassword,
	) {
		const state = ctx.getState();
		let hash: string;

		if (state.mode === AuthMode.Confirmation) {
			hash = state.registerPasswordHash;
		} else {
			hash = state.passwordHash;
		}

		return this.authService.validatePassword(action.password, hash).pipe(
			switchMap((result) => {
				if (result) {
					return ctx.dispatch(
						new AuthActions.Success(action.password),
					);
				}
				return throwError(new Error("PIN_VALIDATION_FAILED"));
			}),
			catchError((e) => {
				ctx.dispatch(new AuthActions.Fail());
				return throwError(e.message);
			}),
		);
	}

	@Action(AuthActions.Fail)
	public fail(ctx: StateContext<AuthStateModel>) {
		const state = ctx.getState();
		const attempts = state.attempts + 1;
		const unlockDate = this.authService.getNextUnlockDate(attempts);
		return ctx.patchState({
			attempts,
			unlockDate,
		});
	}

	@Action(AuthActions.Success)
	public success(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.Success,
	) {
		return ctx.dispatch(new AuthActions.SetPassword(action.password)).pipe(
			tap(() =>
				ctx.patchState({
					attempts: 0,
					unlockDate: undefined,
					mode: undefined,
				}),
			),
		);
	}

	@Action(AuthActions.SetPassword)
	public setPassword(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.SetPassword,
	) {
		const state = ctx.getState();
		const isAuthorization = state.mode === AuthMode.Authorization;

		if (isAuthorization) {
			return;
		}

		const isConfirmation = state.mode === AuthMode.Confirmation;
		const hashedPassword = this.authService.hashPassword(action.password);
		const key = isConfirmation ? "passwordHash" : "registerPasswordHash";

		return ctx.patchState({
			[key]: hashedPassword,
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
