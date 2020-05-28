import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createRoutingFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";

import { OnboardingComponent } from "./onboarding.component";
import { OnboardingService } from "./shared/onboarding.service";

describe("Onboarding Component", () => {
	let spectator: Spectator<OnboardingComponent>;

	const createComponent = createRoutingFactory({
		component: OnboardingComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			RouterModule.forRoot([]),
		],
		providers: [
			mockProvider(OnboardingService, {
				hasSeen: () => of(false),
			}),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => {
		spectator = createComponent();
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	it("should render slides", async () => {
		await sleep(100);
		const slides = spectator.queryAll(byTestId("onboarding__slide"));
		const image = spectator.query(byTestId("onboarding__slide__image"));
		const title = spectator.query(byTestId("onboarding__slide__title"));
		const description = spectator.query(
			byTestId("onboarding__slide__description"),
		);
		expect(slides.length).toBeGreaterThan(1);
		expect(image).toBeVisible();
		expect(title).toBeVisible();
		expect(description).toBeVisible();
	});

	it("should show buttons", async () => {
		await sleep(100);
		const skip = spectator.queryAll(byTestId("onboarding__skip"));
		const next = spectator.queryAll(byTestId("onboarding__next"));
		expect(skip).toBeVisible();
		expect(next).toBeVisible();
	});

	it("should go to the next slide", async () => {
		await sleep(100);
		const next = spectator.query(byTestId("onboarding__next"));
		spectator.click(next);
		await sleep(100);
		const slides = spectator.queryAll(byTestId("onboarding__slide"));
		expect(slides[1]).toHaveClass("swiper-slide-active");
	});

	it("should show the done button and end", async () => {
		await sleep(100);
		const next = spectator.query(byTestId("onboarding__next"));
		spectator.click(next);
		spectator.detectChanges();
		spectator.click(next);
		await sleep(500);
		spectator.detectChanges();

		const doneBtn = spectator.query(byTestId("onboarding__done"));
		expect(doneBtn).toBeVisible();

		const onboardService = spectator.get(OnboardingService);

		spectator.click(doneBtn);
		expect(onboardService.save).toHaveBeenCalled();
	});
});
