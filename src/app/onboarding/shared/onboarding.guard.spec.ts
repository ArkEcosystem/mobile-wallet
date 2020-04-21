import { RouterModule, UrlTree } from "@angular/router";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";

import { OnboardingGuard } from "./onboarding.guard";
import { OnboardingService } from "./onboarding.service";

describe("Onboarding Guard", () => {
	let spectator: SpectatorService<OnboardingGuard>;
	const createService = createServiceFactory({
		service: OnboardingGuard,
		imports: [RouterModule.forRoot([])],
		mocks: [OnboardingService],
	});

	beforeEach(() => (spectator = createService()));

	it("should return true", async () => {
		const onboardingService = spectator.get(OnboardingService);
		onboardingService.hasFinished.and.returnValue(of(false));
		const output = await spectator.service.canActivate().toPromise();
		expect(output).toBeTrue();
	});

	it("should return url", async () => {
		const onboardingService = spectator.get(OnboardingService);
		onboardingService.hasFinished.and.returnValue(of(true));
		const output = await spectator.service.canActivate().toPromise();
		expect(output).toBeInstanceOf(UrlTree);
	});
});
