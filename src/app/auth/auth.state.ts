import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthConfig } from "./auth.config";
import { AuthService } from "./auth.service";

export interface AuthStateModel {
	isOpen: boolean;
	attempts: number;
	unlockTimestamp?: number;
}

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.STORAGE_KEY,
);

@State<AuthStateModel>({
	name: AuthConfig.STORAGE_KEY,
	defaults: {
		isOpen: false,
		attempts: 0,
	},
})
@Injectable()
export class AuthState {
	constructor(private authService: AuthService) {}

	@Selector()
	public static isOpen(state: AuthStateModel) {
		return state.isOpen;
	}

	@Selector()
	public static hasReachedAttemptsLimit(state: AuthStateModel) {
		return state.attempts === 3;
	}

	@Action(AuthActions.Open)
	public open(ctx: StateContext<AuthStateModel>) {
		return ctx.patchState({
			isOpen: true,
		});
	}

	@Action(AuthActions.Cancel)
	public cancel(ctx: StateContext<AuthStateModel>) {
		return ctx.patchState({
			isOpen: false,
		});
	}

	@Action(AuthActions.Validate)
	public validate(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.Validate,
	) {
		const state = ctx.getState();
		return this.authService.validateMasterPassword(action.password).pipe(
			switchMap((result) => {
				if (result) {
					ctx.patchState({
						attempts: 0,
						isOpen: false,
					});
					return of();
				}
				return throwError(new Error("PIN_VALIDATION_FAILED"));
			}),
			catchError((e) => {
				ctx.patchState({
					attempts: state.attempts + 1,
				});
				return throwError(e.message);
			}),
		);
	}
}
