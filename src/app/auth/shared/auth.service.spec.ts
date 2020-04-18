import { fakeAsync, tick } from "@angular/core/testing";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";
import { tap } from "rxjs/operators";

import { StorageProvider } from "@/services/storage/storage";

import { AuthConfig } from "./auth.config";
import { AuthService } from "./auth.service";

describe("Auth Service", () => {
	let spectator: SpectatorService<AuthService>;
	let service: AuthService;
	const createService = createServiceFactory({
		service: AuthService,
		mocks: [StorageProvider],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should validate password as weak", () => {
		const weakPassword = "000000";
		expect(service.isWeakPassword(weakPassword)).toEqual(true);
	});

	it("should validate password as not weak", () => {
		const weakPassword = "AB@#$5";
		expect(service.isWeakPassword(weakPassword)).toEqual(false);
	});

	it("should get password hash stored", () => {
		const storage = spectator.get(StorageProvider);
		storage.get.and.returnValue(of("hash"));
		service.getPasswordHash().subscribe();
		expect(storage.get).toHaveBeenCalled();
	});

	it("should hash password", () => {
		const password = "123456";
		expect(service.hashPassword(password)).not.toEqual(password);
	});

	it("should return true if the password matches the hash", (done) => {
		const password = "123456";
		const hash = service.hashPassword(password);

		service.validatePassword(password, hash).subscribe((result) => {
			expect(result).toBeTrue();
			done();
		});
	});

	it("should return false if the password does not match the hash", (done) => {
		const password = "123456";
		const hash = "abc";

		service.validatePassword(password, hash).subscribe((result) => {
			expect(result).toBeFalse();
			done();
		});
	});

	it("should return undefined if the attempt limit is not reached", () => {
		const attempts = 1;
		expect(service.getNextUnlockDate(attempts)).toBeUndefined();
	});

	it("should return the unlock date if the attempt limit is reached", () => {
		const attempts = 3;
		const nowTime = new Date().getTime() - 1;
		const unlockDate = service.getNextUnlockDate(attempts);
		const expectedMilliseconds = AuthConfig.ATTEMPTS_LIMIT * 10000;
		expect(unlockDate).toEqual(jasmine.any(Date));
		expect(unlockDate.getTime() - nowTime).toBeGreaterThanOrEqual(
			expectedMilliseconds,
		);
	});

	it("should get the unlock countdown", (done) => {
		const countdown = [];
		service
			.getUnlockCountdown(2)
			.pipe(tap((s) => countdown.push(s)))
			.subscribe({
				complete: () => {
					expect(countdown).toEqual([2, 1, 0]);
					done();
				},
			});
	});

	it("should get the remaining seconds", () => {
		const nowTime = new Date().getTime();
		const nowDate = new Date(nowTime + 3 * 1000);
		expect(service.getUnlockRemainingSeconds(nowDate)).toEqual(3);
		expect(service.getUnlockRemainingSeconds(undefined)).toBeUndefined();
	});

	it("should return true if date expired", fakeAsync(() => {
		const unlockDate = new Date();
		tick(1000);
		expect(service.hasUnlockDateExpired(unlockDate)).toBeTrue();
		expect(service.hasUnlockDateExpired(undefined)).toBeTrue();
	}));

	it("should return false if the date has not expired", () => {
		const unlockTime = new Date().getTime();
		const unlockDate = new Date(unlockTime + 1000);
		expect(service.hasUnlockDateExpired(unlockDate)).toBeFalse();
	});
});
