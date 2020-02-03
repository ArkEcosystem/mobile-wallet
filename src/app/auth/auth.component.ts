import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthActions } from "./shared/auth.actions";
import { AUTH_STATE_TOKEN } from "./shared/auth.state";
import { AuthMethod, AuthStateModel } from "./shared/auth.type";

@Component({
	selector: "auth-handler",
	templateUrl: "auth.component.html",
	styleUrls: ["auth.component.pcss"],
})
export class AuthComponent implements OnInit {
	@Select(state => state.auth.method === AuthMethod.Pin)
	public isPinMethod$: Observable<boolean>;

	public state: AuthStateModel;

	constructor(private store: Store) {}

	ngOnInit() {
		this.store
			.select(AUTH_STATE_TOKEN)
			.subscribe(state => (this.state = state));
	}

	public setPin() {
		this.store.dispatch(new AuthActions.SetMethod(AuthMethod.Pin));
	}

	public fail() {
		this.store.dispatch(new AuthActions.IncreaseAttempts());
	}

	public authorize() {
		this.store.dispatch(new AuthActions.Authorize());
	}

	public deny() {
		this.store.dispatch(new AuthActions.Deny());
	}
}
