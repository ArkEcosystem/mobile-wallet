import { Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthActions } from "./shared/auth.actions";
import { AUTH_STATE_TOKEN, AuthState } from "./shared/auth.state";
import { AuthMethod, AuthStateModel } from "./shared/auth.type";

@Component({
	selector: "auth-handler",
	templateUrl: "auth.component.html",
})
export class AuthComponent {
	@Select(state => state.auth.method === AuthMethod.Pin)
	public isPinMethod$: Observable<boolean>;

	@Select(AUTH_STATE_TOKEN)
	public state$: Observable<AuthStateModel>;

	constructor(private store: Store) {}

	public setPin() {
		this.store.dispatch(new AuthActions.SetMethod(AuthMethod.Pin));
	}

	public authorize() {
		AuthState.subject.next();
	}

	public deny() {
		AuthState.subject.error("Failed");
	}
}
