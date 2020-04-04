import { Injectable } from "@angular/core";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { from, Observable, timer } from "rxjs";
import { map, switchMap, takeWhile } from "rxjs/operators";

import { StorageProvider } from "@/services/storage/storage";

import { AuthConfig } from "./auth.config";

@Injectable()
export class AuthService {
	constructor(private storageProvider: StorageProvider) {}

	public saveMasterPassword(password: string): Observable<any> {
		const hash = bcrypt.hashSync(password, 8);

		return this.storageProvider.set(
			AuthConfig.STORAGE_MASTERPASSWORD,
			hash,
		);
	}

	public validateMasterPassword(password: string): Observable<boolean> {
		return this.storageProvider
			.get(AuthConfig.STORAGE_MASTERPASSWORD)
			.pipe(
				switchMap((master: string) =>
					from(bcrypt.compare(password, master)),
				),
			);
	}

	public getNextUnlockDate(attempts: number): undefined | Date {
		const currentAttempt = attempts - 3;
		if (currentAttempt <= 0) {
			return undefined;
		}
		const remainingSeconds = currentAttempt * 30;
		const now = dayjs();
		const next = now.add(remainingSeconds, "second");

		return next.toDate();
	}

	public getUnlockRemainingSeconds(
		unlockDate: Date | undefined,
	): undefined | number {
		if (!unlockDate) {
			return;
		}

		return dayjs(unlockDate).diff(dayjs(), "second");
	}

	public getUnlockCountdown(remainingSeconds: number): Observable<number> {
		return timer(0, 1000).pipe(
			map((seconds) => remainingSeconds - seconds),
			takeWhile((diffTime) => diffTime >= 0),
		);
	}

	public hasUnlockDateExpired(unlockDate: Date | undefined): boolean {
		if (!unlockDate) {
			return true;
		}

		return dayjs().isAfter(unlockDate);
	}
}
