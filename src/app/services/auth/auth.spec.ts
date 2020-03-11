import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";

import * as constants from "@/app/app.constants";
import { StorageProvider } from "@/services/storage/storage";

import { AuthProvider } from "./auth";

fdescribe("Auth Service", () => {
	let authService: AuthProvider;
	let storageService: StorageProvider;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [IonicStorageModule.forRoot()],
			providers: [AuthProvider, StorageProvider],
		});

		authService = TestBed.inject(AuthProvider);
		storageService = TestBed.inject(StorageProvider);
	});

	beforeEach(function() {
		storageService.clear();
	});

	it("should login an user", done => {
		const USER_ID = "12341231212312312312312";

		authService.login(USER_ID).subscribe(authData => {
			expect(authService.loggedProfileId).toEqual(USER_ID);
			done();
		});
	});

	it("should logout an user", () => {
		authService.logout();
		expect(authService.loggedProfileId).toEqual(undefined);
	});

	it("should verify if user has seen intro", done => {
		authService.hasSeenIntro().subscribe(data => {
			expect(data).toBe(false);
			done();
		});
	});
});
