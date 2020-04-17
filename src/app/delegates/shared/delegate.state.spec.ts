import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";

import { DelegateActions } from "./delegate.actions";
import { DelegateService } from "./delegate.service";
import { DelegateServiceMock } from "./delegate.service.mock";
import { DELEGATE_STATE_TOKEN, DelegateState } from "./delegate.state";

describe("Delegate State", () => {
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([DelegateState])],
			providers: [
				{
					provide: DelegateService,
					useClass: DelegateServiceMock,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(DELEGATE_STATE_TOKEN);
		const delegates = store.selectSnapshot(DelegateState.delegates);
		expect(state).toEqual({
			delegates: [],
			totalCount: 0,
		});
		expect(delegates.length).toBe(0);
	});

	it("should fetch delegates", async () => {
		await store
			.dispatch(new DelegateActions.Fetch({ page: 1, limit: 10 }))
			.toPromise();
		const state = store.selectSnapshot(DELEGATE_STATE_TOKEN);
		expect(state.delegates.length).toBeGreaterThan(1);
		// expect(state.totalCount).toBeGreaterThan(1);
	});

	it("should clear", () => {
		store.dispatch(new DelegateActions.Clear());
		const state = store.selectSnapshot(DELEGATE_STATE_TOKEN);
		expect(state.delegates.length).toBe(0);
		expect(state.totalCount).toBe(0);
	});
});
