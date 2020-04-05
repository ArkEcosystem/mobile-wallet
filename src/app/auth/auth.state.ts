import { Injectable } from "@angular/core";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";

import { AuthActions } from "./auth.actions";
import { AuthConfig, AuthMethod, AuthMode } from "./auth.config";
import { AuthService } from "./auth.service";

export interface AuthStateModel {
	attempts: number;
	unlockDate?: Date;
	mode?: AuthMode;
	method?: AuthMethod;
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

	@Selector()
	public static mode(state: AuthStateModel) {
		return state.mode;
	}

	ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		const state = ctx.getState();
		if (this.authService.hasUnlockDateExpired(state.unlockDate)) {
			return ctx.patchState({
				unlockDate: undefined,
			});
		}
	}

	@Action(AuthActions.Open)
	public open(ctx: StateContext<AuthStateModel>, action: AuthActions.Open) {
		return ctx.patchState({
			mode: action.payload.mode,
		});
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
	public success(ctx: StateContext<AuthStateModel>) {
		return ctx.patchState({
			attempts: 0,
			unlockDate: undefined,
		});
	}
}
