import { PinActions } from "@/app/pin/shared/pin.actions";
import {
	Action,
	NgxsOnInit,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { AuthConfig } from "../auth.config";
import { AuthActions } from "./auth.actions";
import { AuthService } from "./auth.service";
import { AuthStateModel } from "./auth.type";

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.TOKEN,
);

@State<AuthStateModel>({
	name: AUTH_STATE_TOKEN,
	defaults: {
		id: null,
	},
})
export class AuthState implements NgxsOnInit {
	constructor(private authService: AuthService) {}

	public ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
		this.authService.isExpired().subscribe(isExpired => {
			if (isExpired) {
				// TODO:
				// ctx.dispatch(new PinActions.Request());
			}
		});
	}

	@Action(AuthActions.Login)
	public login(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.Login,
	): Observable<void> {
		return ctx.dispatch(new PinActions.Request()).pipe(
			switchMap(() => {
				return this.authService.login(action.id).pipe(
					tap(() => {
						ctx.setState({ id: action.id });
					}),
				);
			}),
		);
	}

	@Action(AuthActions.Login)
	public logout(ctx: StateContext<AuthStateModel>): Observable<void> {
		return this.authService.logout().pipe(
			tap(() => {
				ctx.setState({ id: null });
			}),
		);
	}
}
