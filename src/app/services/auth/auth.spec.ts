import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
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
});
