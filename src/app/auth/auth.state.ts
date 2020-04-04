import { Injectable } from "@angular/core";
import {
	Action,
	NgxsOnInit,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthConfig } from "./auth.config";
import { AuthService } from "./auth.service";

export interface AuthStateModel {
	attempts: number;
	unlockDate?: Date;
}

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.STORAGE_KEY,
);

@State<AuthStateModel>({
	name: AuthConfig.STORAGE_KEY,
	defaults: {
		attempts: 0,
	},
})
@Injectable()
export class AuthState implements NgxsOnInit {
	constructor(private authService: AuthService) {}

	ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		const state = ctx.getState();
		if (this.authService.hasUnlockDateExpired(state.unlockDate)) {
			return ctx.patchState({
				unlockDate: undefined,
			});
		}
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
						unlockDate: undefined,
					});
					return of();
				}
				return throwError(new Error("PIN_VALIDATION_FAILED"));
			}),
			catchError((e) => {
				const attempts = state.attempts + 1;
				const unlockDate = this.authService.getNextUnlockDate(attempts);
				ctx.patchState({
					attempts,
					unlockDate,
				});
				return throwError(e.message);
			}),
		);
	}
}
