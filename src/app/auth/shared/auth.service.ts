import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import moment from "moment";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthConfig } from "../auth.config";

@Injectable()
export class AuthService {
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
			.add(AuthConfig.EXPIRES_IN_SECONDS, "s")
			.toDate();

		return this.storage.set(AuthConfig.STORAGE_SESSION_ID, profileId).pipe(
			switchMap(() => {
				return this.storage.set(
					AuthConfig.STORAGE_EXPIRES_AT,
					expiresIn,
				);
			}),
		);
	}

	public logout(): Observable<void> {
		return this.storage.set(AuthConfig.STORAGE_SESSION_ID, undefined).pipe(
			switchMap(() => {
				return this.storage.set(
					AuthConfig.STORAGE_EXPIRES_AT,
					undefined,
				);
			}),
		);
	}

	public getSessionId(): Observable<string | undefined> {
		return this.storage.get(AuthConfig.STORAGE_SESSION_ID);
	}

	private getExpiration(): Observable<string | undefined> {
		return this.storage.get(AuthConfig.STORAGE_EXPIRES_AT);
	}
}
