import { AuthProvider } from "@/services/auth/auth";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class IntroGuard implements CanActivate {
	constructor(private router: Router, private authProvider: AuthProvider) {}

	canActivate(): Observable<boolean> {
		return this.authProvider.hasSeenIntro().pipe(
			map(hasSeenIntro => {
				if (!hasSeenIntro) {
					return true;
				}
				this.router.navigateByUrl("/login");
				return false;
			}),
		);
	}
}
