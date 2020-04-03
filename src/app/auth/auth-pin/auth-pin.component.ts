import { Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthActions } from "../auth.actions";
import { AuthState } from "../auth.state";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
})
export class AuthPinComponent {
	@Select(AuthState.hasReachedAttemptsLimit)
	public hasReachedAttemptsLimit$: Observable<boolean>;

	public password: number[] = [];

	constructor(private store: Store) {}

	public handleInput(value: string) {
		this.password.push(parseInt(value));
		if (this.password.length === 5) {
			this.verify();
		}
	}

	private verify() {
		this.store.dispatch(new AuthActions.Validate(this.password.join("")));
	}
}
