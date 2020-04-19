import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { OnboardingActions } from "./onboarding.actions";
import { OnboardingService } from "./onboarding.service";
import { ONBOARDING_STATE_TOKEN, OnboardingState } from "./onboarding.state";
import { OnboardingStateModel } from "./onboarding.state";

describe("Onboarding State", () => {
	const defaultState: OnboardingStateModel = {
		isFinished: false,
	};
	const onboardingServiceSpy = {
		load: () => of(undefined),
	};
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([OnboardingState])],
			providers: [
				{
					provide: OnboardingService,
					useValue: onboardingServiceSpy,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(ONBOARDING_STATE_TOKEN);
		expect(state).toEqual(defaultState);
	});

	it("should return isFinished", () => {
		const activeIndex = store.selectSnapshot(OnboardingState.isFinished);
		expect(activeIndex).toEqual(false);
	});

	it("should end", () => {
		store.dispatch(new OnboardingActions.Done());
		const isFinished = store.selectSnapshot(OnboardingState.isFinished);
		expect(isFinished).toEqual(true);
	});
});
