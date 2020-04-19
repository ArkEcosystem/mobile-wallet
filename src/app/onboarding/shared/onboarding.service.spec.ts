import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { OnboardingService } from "./onboarding.service";

describe("Onboarding Service", () => {
	let spectator: SpectatorService<OnboardingService>;
	let service: OnboardingService;

	const createService = createServiceFactory({
		service: OnboardingService,
		mocks: [StorageProvider],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should load data", (done) => {
		const storageProvider = spectator.get(StorageProvider);
		storageProvider.get.and.returnValue(of("true"));
		service.load().subscribe((data) => {
			expect(data).toBe("true");
			done();
		});
	});
});
