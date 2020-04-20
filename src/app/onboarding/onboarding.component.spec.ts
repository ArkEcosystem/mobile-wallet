import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createRoutingFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { Actions, NgxsModule, ofActionDispatched } from "@ngxs/store";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";

import { OnboardingComponent } from "./onboarding.component";
import { OnboardingActions } from "./shared/onboarding.actions";
import { OnboardingService } from "./shared/onboarding.service";
import { OnboardingState } from "./shared/onboarding.state";

describe("Onboarding Component", () => {
	let spectator: Spectator<OnboardingComponent>;

	const createComponent = createRoutingFactory({
		component: OnboardingComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([OnboardingState]),
			RouterModule.forRoot([]),
		],
		providers: [
			mockProvider(OnboardingService, {
				load: () => of(undefined),
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

	it("should show the done button and end", async (done) => {
		await sleep(100);
		const next = spectator.query(byTestId("onboarding__next"));
		spectator.click(next);
		spectator.detectChanges();
		spectator.click(next);
		await sleep(500);
		spectator.detectChanges();

		const doneBtn = spectator.query(byTestId("onboarding__done"));
		expect(doneBtn).toBeVisible();

		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(OnboardingActions.Done))
			.subscribe(() => done());

		spectator.click(doneBtn);
	});
});
