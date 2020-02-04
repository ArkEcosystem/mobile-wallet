import { VOID } from "@/app/core/operators";
import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import moment from "moment";
import { EMPTY, iif, Observable, of } from "rxjs";
import { map, mapTo, switchMap, switchMapTo } from "rxjs/operators";
import { AuthConfig } from "../auth.config";
import { AuthPersistedData } from "./auth.type";

@Injectable()
export class AuthService {
	constructor(private storageService: StorageService) {}

	public load(): Observable<AuthPersistedData> {
		return this.verifyUnlockDate().pipe(
			switchMapTo(this.getAttempts()),
			switchMap(attempts =>
				this.getUnlockDate().pipe(
					map(unlockDate => ({ attempts, unlockDate })),
				),
			),
		);
	}

	public increaseAttempts(attempts: number): Observable<AuthPersistedData> {
		return this.storageService
			.set(AuthConfig.STORAGE_ATTEMPTS, attempts)
			.pipe(
				switchMap(() =>
					iif(
						() => attempts > AuthConfig.ATTEMPTS_LIMIT,
						this.increaseUnlockTimestamp(attempts),
						of(undefined),
					),
				),
				map(timestamp => ({ unlockDate: timestamp, attempts })),
			);
	}

	public reset(): Observable<void> {
		return this.storageService
			.set(AuthConfig.STORAGE_UNLOCK_TIMESTAMP, null)
			.pipe(
				switchMap(() =>
					this.storageService.set(AuthConfig.STORAGE_ATTEMPTS, 0),
				),
			);
	}

	public verifyUnlockDate(): Observable<never | void> {
		return this.getUnlockTimestamp().pipe(
			switchMap(unlockDate => {
				if (!unlockDate) {
					return EMPTY;
				}

				const now = moment.now();
				const timestampDiffSeconds = moment(unlockDate).diff(
					now,
					"seconds",
				);

				if (timestampDiffSeconds < 0) {
					return this.reset().pipe(switchMapTo(VOID));
				}

				return VOID;
			}),
		);
	}

	private getAttempts(): Observable<number> {
		return this.storageService
			.get(AuthConfig.STORAGE_ATTEMPTS)
			.pipe(map(attempts => parseInt(attempts)));
	}

	private getUnlockDate(): Observable<Date | undefined> {
		return this.getUnlockTimestamp().pipe(
			switchMap(timestampRaw => {
				if (!timestampRaw) {
					return of(undefined);
				}

				const timestamp = moment(timestampRaw);
				const timestampDate = timestamp.toDate();

				return of(timestampDate);
			}),
		);
	}

	private increaseUnlockTimestamp(attempts: number): Observable<Date> {
		const currentAttempt = attempts - AuthConfig.ATTEMPTS_LIMIT + 1;
		const lastTimestamp = moment();
		const nextTimestamp = lastTimestamp
			.add(AuthConfig.ATTEMPTS_TIMEOUT_SECONDS * currentAttempt, "s")
			.toDate();
		return this.storageService
			.set(AuthConfig.STORAGE_UNLOCK_TIMESTAMP, nextTimestamp)
			.pipe(mapTo(nextTimestamp));
	}

	private getUnlockTimestamp(): Observable<string | undefined> {
		return this.storageService.get(AuthConfig.STORAGE_UNLOCK_TIMESTAMP);
	}
}
