import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { iif, NEVER, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthMethod } from "./auth.config";
import { AuthService } from "./auth.service";
import { AUTH_STATE_TOKEN, AuthStateModel } from "./auth.state";

@Component({
	selector: "auth",
	templateUrl: "auth.component.html",
	styles: [
		`
			:host {
				height: 100%;
			}
		`,
	],
})
export class AuthComponent implements OnInit {
	public isTouchAvailable$: Observable<boolean>;
	public unlockTimestamp$: Observable<number>;
	public activeMethod$: Observable<string>;

	public methods = [AuthMethod.Pin, AuthMethod.TouchID];

	@Select(AUTH_STATE_TOKEN)
	public state: Observable<AuthStateModel>;

	constructor(private store: Store, private authService: AuthService) {}

	ngOnInit() {
		this.isTouchAvailable$ = of(true);
		this.activeMethod$ = this.state.pipe(
			map((state) => state.method || AuthMethod.Pin),
		);
		this.unlockTimestamp$ = this.state.pipe(
			map((state) =>
				this.authService.getUnlockRemainingSeconds(state.unlockDate),
			),
			switchMap((remainingSeconds) => {
				return iif(
					() => !!remainingSeconds,
					this.authService.getUnlockCountdown(remainingSeconds),
					NEVER,
				);
			}),
		);
	}

	public onSegmentChanged(event: CustomEvent) {
		const value = event.detail.value;
		this.store.dispatch(new AuthActions.SetMethod(value));
	}
}
