import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import moment from "moment";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { LoginConfig } from "../login.config";

@Injectable()
export class LoginService {
	constructor(private storage: StorageService) {}

	public isLoggedIn(): Observable<boolean> {
		return this.getSessionId().pipe(
			switchMap(id => {
				return of(!!id);
			}),
		);
	}

	public isExpired(): Observable<boolean | undefined> {
		return this.getExpiration().pipe(
			switchMap(expiration => {
				if (expiration) {
					return of(moment().isBefore(expiration));
				}

				return of(undefined);
			}),
		);
	}

	public login(profileId: string): Observable<void> {
		const expiresIn = moment()
			.add(LoginConfig.EXPIRES_IN_SECONDS, "s")
			.toDate();

		return this.storage.set(LoginConfig.STORAGE_SESSION_ID, profileId).pipe(
			switchMap(() => {
				return this.storage.set(
					LoginConfig.STORAGE_EXPIRES_AT,
					expiresIn,
				);
			}),
		);
	}

	public logout(): Observable<void> {
		return this.storage.set(LoginConfig.STORAGE_SESSION_ID, undefined).pipe(
			switchMap(() => {
				return this.storage.set(
					LoginConfig.STORAGE_EXPIRES_AT,
					undefined,
				);
			}),
		);
	}

	public getSessionId(): Observable<string | undefined> {
		return this.storage.get(LoginConfig.STORAGE_SESSION_ID);
	}

	private getExpiration(): Observable<string | undefined> {
		return this.storage.get(LoginConfig.STORAGE_EXPIRES_AT);
	}
}
