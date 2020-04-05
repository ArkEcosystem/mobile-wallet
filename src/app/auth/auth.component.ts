import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { iif, NEVER, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AUTH_STATE_TOKEN } from "./auth.state";

@Component({
	selector: "auth",
	templateUrl: "auth.component.html",
})
export class AuthComponent implements OnInit {
	public unlockTimestamp$: Observable<any>;

	constructor(private store: Store, private authService: AuthService) {}

	ngOnInit() {
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
