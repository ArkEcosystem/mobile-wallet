import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { SdkEnvironment } from "@/app/sdk/shared/sdk-env.service";
import { SdkHttpService } from "@/app/sdk/shared/sdk-http.service";
import { SdkStorageService } from "@/app/sdk/shared/sdk-storage.service";

import { OnboardingService } from "./onboarding.service";

describe("Onboarding Service", () => {
	let spectator: SpectatorService<OnboardingService>;
	let service: OnboardingService;

	const createService = createServiceFactory({
		service: OnboardingService,
		mocks: [SdkHttpService, SdkStorageService],
		providers: [SdkEnvironment],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should check state data", async () => {
		const sdkStorageService = spectator.get(SdkStorageService);
		sdkStorageService.get.and.resolveTo({ onboarding: "true" });
		const result = await service.hasSeen().toPromise();
		expect(result).toBeTrue();
	});
});
