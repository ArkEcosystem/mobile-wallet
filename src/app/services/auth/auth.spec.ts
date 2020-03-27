import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import * as bcrypt from "bcryptjs";
import { switchMap } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { StorageProvider } from "@/services/storage/storage";

import { AuthProvider } from "./auth";

const MASTER_PASSWORD = "master_password_test";

describe("Auth Service", () => {
	let authService: AuthProvider;
	let storageService: StorageProvider;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [IonicStorageModule.forRoot()],
			providers: [AuthProvider, StorageProvider],
		});

		authService = TestBed.inject(AuthProvider);
		storageService = TestBed.inject(StorageProvider);
	});

	beforeEach(function () {
		storageService.clear();
	});

	it("should login an user", (done) => {
		const USER_ID = "12341231212312312312312";
		authService
			.login(USER_ID)
			.pipe(
				switchMap(() =>
					storageService.get(constants.STORAGE_ACTIVE_PROFILE),
				),
			)
			.subscribe((id) => {
				expect(id).toBe(USER_ID);
				done();
			});
	});

	it("should logout an user", () => {
		authService.logout();
		expect(authService.loggedProfileId).toEqual(undefined);
	});

	it("should logout an user without broadcast", () => {
		authService.logout(false);
		expect(authService.loggedProfileId).toEqual(undefined);
	});

	it("should verify if user has seen intro", (done) => {
		authService.hasSeenIntro().subscribe((data) => {
			expect(data).toBe(false);
			done();
		});
	});

	it("should set intro as seen", (done) => {
		authService
			.saveIntro()
			.pipe(
				switchMap(() =>
					storageService.get(constants.STORAGE_INTROSEEN),
				),
			)
			.subscribe((introSeen) => {
				expect(introSeen).toEqual("true");
				done();
			});
	});

	it("should save and get the stored master password", (done) => {
		authService.saveMasterPassword(MASTER_PASSWORD).subscribe(() => {
			authService.getMasterPassword().subscribe((masterPassword) => {
				expect(masterPassword).not.toEqual(null);
				done();
			});
		});
	});

	it("should get an error on master password validation", (done) => {
		// @ts-ignore
		spyOn(bcrypt, "compare").and.callFake((_, __, callback) => {
			callback(new Error("Failed"));
		});

		authService.saveMasterPassword(MASTER_PASSWORD).subscribe(() => {
			authService
				.validateMasterPassword(MASTER_PASSWORD)
				.subscribe(null, (e: Error) => {
					expect(e.message).toBe("Failed");
					done();
				});
		});
	});

	it("should validate the master password", (done) => {
		authService.saveMasterPassword(MASTER_PASSWORD).subscribe(() => {
			authService
				.validateMasterPassword(MASTER_PASSWORD)
				.subscribe((result) => {
					expect(result).toEqual(true);
					done();
				});
		});
	});

	it("should validate the master password with a wrong one", (done) => {
		authService.saveMasterPassword(MASTER_PASSWORD).subscribe(() => {
			authService
				.validateMasterPassword("asjdaidsa")
				.subscribe((result) => {
					expect(result).toEqual(false);
					done();
				});
		});
	});

	it("should validate password as weak", () => {
		const WEAK_PASSWORD = "000000";
		expect(authService.isWeakPassword(WEAK_PASSWORD)).toEqual(true);
	});

	it("should validate password as not weak", () => {
		const WEAK_PASSWORD = "AB@#$5";
		expect(authService.isWeakPassword(WEAK_PASSWORD)).toEqual(false);
	});

	it("should rerturn the unlock timestamp", (done) => {
		authService.getUnlockTimestamp().subscribe((unlockTime) => {
			expect(unlockTime).toEqual({});
			done();
		});
	});

	it("should rerturn the attempts", (done) => {
		authService.getAttempts().subscribe((attempts) => {
			expect(attempts).toEqual(null);
			done();
		});
	});

	it("should increase attemps", (done) => {
		authService
			.increaseAttempts()
			.pipe(
				switchMap(() =>
					storageService.get(constants.STORAGE_AUTH_ATTEMPTS),
				),
			)
			.subscribe((attempts) => {
				expect(attempts).toBe("1");
				done();
			});
	});

	it("should increase unlock timestamp", (done) => {
		authService.increaseUnlockTimestamp().then((newTimestamp) => {
			expect(newTimestamp).not.toBe(null);
			done();
		});
	});

	it("should clear attempts", (done) => {
		authService.clearAttempts().subscribe(() => {
			authService.getAttempts().subscribe((attempts) => {
				expect(attempts).toEqual(0);
				done();
			});
		});
	});
});
