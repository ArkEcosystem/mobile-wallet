import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

import { OnboardingConfig } from "./onboarding.config";
import { OnboardingService } from "./onboarding.service";

describe("Onboarding Service", () => {
	let spectator: SpectatorService<OnboardingService>;
	let service: OnboardingService;

	const createService = createServiceFactory({
		service: OnboardingService,
		mocks: [AsyncStorageService],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should check legacy data", () => {
		const asyncStorageService = spectator.get(AsyncStorageService);
		asyncStorageService.getItem.and.returnValue(of("true"));
		service.hasFinishedLegacy().subscribe((data) => {
			expect(data).toBe(true);
		});
	});

	it("should check state data", () => {
		const asyncStorageService = spectator.get(AsyncStorageService);
		asyncStorageService.getItem
			.withArgs(OnboardingConfig.LEGACY_STORAGE_KEY)
			.and.returnValue(of(undefined));
		asyncStorageService.getItem
			.withArgs(OnboardingConfig.STORAGE_KEY)
			.and.returnValue(of(`{"isFinished":true}`));
		service.hasFinished().subscribe((data) => {
			expect(data).toBe(true);
		});
	});
});
