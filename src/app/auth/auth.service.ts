import { Injectable } from "@angular/core";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { from, Observable, timer } from "rxjs";
import { map, takeWhile } from "rxjs/operators";

import { StorageProvider } from "@/services/storage/storage";

import { AuthConfig } from "./auth.config";

@Injectable()
export class AuthService {
	constructor(private storageProvider: StorageProvider) {}

	public isWeakPassword(password: string): boolean {
		return AuthConfig.WEAK_PASSWORDS.includes(password);
	}

	public getPasswordHash(): Observable<string | undefined> {
		return this.storageProvider.get(AuthConfig.STORAGE_MASTERPASSWORD);
	}

	public hashPassword(password: string): string {
		return bcrypt.hashSync(password, 8);
	}

	public validatePassword(
		password: string,
		hash: string,
	): Observable<boolean> {
		return from(bcrypt.compare(password, hash));
	}

	public getNextUnlockDate(attempts: number): undefined | Date {
		const currentAttempt = attempts + 1 - AuthConfig.ATTEMPTS_LIMIT;
		if (currentAttempt <= 0) {
			return undefined;
		}
		const remainingSeconds =
			currentAttempt * AuthConfig.ATTEMPTS_TIMEOUT_SECONDS;
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
