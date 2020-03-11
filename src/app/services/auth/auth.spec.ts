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
});
