import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { OnboardingService } from "./onboarding.service";

@Injectable({ providedIn: "root" })
export class OnboardingGuard implements CanActivate {
	constructor(
		private router: Router,
		private onboardingService: OnboardingService,
	) {}

	canActivate(): Observable<boolean | UrlTree> {
		return this.onboardingService.hasFinished().pipe(
			map((result) => {
				if (result) {
					return this.router.parseUrl("/login");
				}
				return true;
			}),
		);
	}
}
