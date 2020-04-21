import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { mapTo, mergeMapTo, tap } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { StorageProvider } from "@/services/storage/storage";

@Injectable({ providedIn: "root" })
export class AuthProvider {
	public onLogin$: Subject<string> = new Subject();
	public onLogout$: Subject<boolean> = new Subject();

	public loggedProfileId: string;

	constructor(private storage: StorageProvider) {}

	login(profileId: string): Observable<boolean> {
		return this.storage
			.set(constants.STORAGE_ACTIVE_PROFILE, profileId)
			.pipe(
				mergeMapTo(this.storage.set(constants.STORAGE_LOGIN, true)),
				tap(() => {
					this.loggedProfileId = profileId;
					this.onLogin$.next(profileId);
				}),
				mapTo(true),
			);
	}

	logout(broadcast: boolean = true): void {
		this.storage.set(constants.STORAGE_LOGIN, false);
		this.storage.set(constants.STORAGE_ACTIVE_PROFILE, undefined);
		this.loggedProfileId = undefined;

		if (broadcast) {
			this.onLogout$.next(false);
		}
	}
}
