import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthActions } from "../auth.actions";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
	styleUrls: ["auth-pin.component.pcss"],
})
export class AuthPinComponent {
	public passwordRange = Array(6).fill(undefined);
	public password: number[] = [];
	public hasWrong = false;

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
			setTimeout(() => this.verify(), 20);
		}
	}

	private verify() {
		const password = this.password.join("");
		this.store
			.dispatch(new AuthActions.Validate(password))
			.pipe(
				catchError((x) => {
					this.handleWrong();
					return of();
				}),
			)
			.subscribe();
	}

	private handleWrong() {
		this.hasWrong = true;
		this.password = [];
		setTimeout(() => {
			this.hasWrong = false;
		}, 500);
	}
}
