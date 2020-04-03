import { Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthActions } from "../auth.actions";
import { AuthState } from "../auth.state";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
	styleUrls: ["auth-pin.component.pcss"],
})
export class AuthPinComponent {
	@Select(AuthState.hasReachedAttemptsLimit)
	public hasReachedAttemptsLimit$: Observable<boolean>;

	public passwordRange = Array(6).fill(undefined);
	public password: number[] = [];

	constructor(private store: Store) {}

	public handleInput(value: number) {
		if (this.password.length > 6) {
			return;
		}

		if (value === -1) {
			this.password.pop();
		} else {
			this.password.push(value);
		}

		if (this.password.length === 6) {
			setTimeout(() => this.verify(), 50);
		}
	}

	private verify() {
		const password = this.password.join("");
		this.store
			.dispatch(new AuthActions.Validate(password))
			.pipe(
				catchError((x) => {
					this.password = [];
					return of();
				}),
			)
			.subscribe();
	}
}
