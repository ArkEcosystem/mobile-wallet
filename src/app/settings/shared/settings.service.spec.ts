import { IonicStorageModule } from "@ionic/storage";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

import { SettingsConfig } from "./settings.config";
import { SettingsService } from "./settings.service";

describe("Onboarding Service", () => {
	let settingsSpectator: SpectatorService<SettingsService>;
	let asyncStorageSpectator: SpectatorService<AsyncStorageService>;
	let settingsService: SettingsService;
	let asyncStorageService: AsyncStorageService;

	const createSettingsService = createServiceFactory({
		service: SettingsService,
		mocks: [AsyncStorageService],
	});

	const createAsyncStorageService = createServiceFactory({
		service: AsyncStorageService,
		imports: [IonicStorageModule.forRoot()],
	});

	beforeEach(() => {
		settingsSpectator = createSettingsService();
		asyncStorageSpectator = createAsyncStorageService();
		settingsService = settingsSpectator.service;
		asyncStorageService = asyncStorageSpectator.service;
	});

	it("should clear", (done) => {
		asyncStorageService.setItem(SettingsConfig.STORAGE_KEY, { a: true });
		settingsService.clear();

		asyncStorageService
			.getItem(SettingsConfig.STORAGE_KEY)
			.subscribe((data) => {
				expect(data).toBe(null);
				done();
			});
	});
});
