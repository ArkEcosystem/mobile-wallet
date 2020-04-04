import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { iif, NEVER, Observable, Subject } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AUTH_STATE_TOKEN } from "./auth.state";

@Component({
	selector: "auth",
	templateUrl: "auth.component.html",
})
export class AuthComponent implements OnInit, OnDestroy {
	public unlockTimestamp$: Observable<any>;
	public destroy$ = new Subject();

	constructor(private store: Store, private authService: AuthService) {
		this.unlockTimestamp$ = this.store.select(AUTH_STATE_TOKEN).pipe(
			takeUntil(this.destroy$),
			tap((x) => console.log(x)),
			map((state) =>
				this.authService.getUnlockRemainingSeconds(state.unlockDate),
			),
			switchMap((remainingSeconds) => {
				console.log(1, remainingSeconds);
				return iif(
					() => !!remainingSeconds,
					this.authService
						.getUnlockCountdown(remainingSeconds)
						.pipe(tap((x) => console.log(2))),
					NEVER,
				);
			}),
		);
	}

	ngOnDestroy() {
		console.log("destroy");
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit() {
		console.log("init");
	}
}
