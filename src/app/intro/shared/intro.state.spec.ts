import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { IntroActions } from "./intro.actions";
import { IntroService } from "./intro.service";
import { INTRO_STATE_TOKEN, IntroState } from "./intro.state";
import { IntroStateModel } from "./intro.type";

describe("Intro State", () => {
	const defaultState: IntroStateModel = {
		activeIndex: 0,
		paginationSize: 3,
		isFinished: false,
	};
	const introServiceSpy = {
		load: () => of(defaultState),
	};
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([IntroState])],
			providers: [
				{
					provide: IntroService,
					useValue: introServiceSpy,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(INTRO_STATE_TOKEN);
		expect(state).toEqual(defaultState);
	});

	it("should return isFinished", () => {
		const activeIndex = store.selectSnapshot(IntroState.isFinished);
		expect(activeIndex).toEqual(false);
	});

	it("should return the active index", () => {
		const activeIndex = store.selectSnapshot(IntroState.activeIndex);
		expect(activeIndex).toEqual(0);
	});

	it("should load", () => {
		store.dispatch(new IntroActions.Load());
		const state = store.selectSnapshot(INTRO_STATE_TOKEN);
		expect(state).toEqual(defaultState);
	});

	it("should update the value", () => {
		store.dispatch(new IntroActions.Update({ activeIndex: 1 }));
		const activeIndex = store.selectSnapshot(IntroState.activeIndex);
		expect(activeIndex).toEqual(1);
	});

	it("should end", () => {
		store.dispatch(new IntroActions.Done());
		const isFinished = store.selectSnapshot(IntroState.isFinished);
		expect(isFinished).toEqual(true);
	});
});
