import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { OnboardingState } from "./onboarding.state";

@Injectable({ providedIn: "root" })
export class OnboardingGuard implements CanActivate {
	constructor(private router: Router, private store: Store) {}

	canActivate(): Observable<boolean | UrlTree> {
		return this.store.select(OnboardingState.isFinished).pipe(
			map((result) => {
				if (result) {
					return this.router.parseUrl("/login");
				}
				return true;
			}),
		);
	}
}
