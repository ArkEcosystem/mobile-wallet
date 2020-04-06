import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { iif, NEVER, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AUTH_STATE_TOKEN } from "./auth.state";

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
	public unlockTimestamp$: Observable<any>;

	constructor(private store: Store, private authService: AuthService) {}

	ngOnInit() {
		this.isTouchAvailable$ = of(true);
		this.unlockTimestamp$ = this.store.select(AUTH_STATE_TOKEN).pipe(
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
}
