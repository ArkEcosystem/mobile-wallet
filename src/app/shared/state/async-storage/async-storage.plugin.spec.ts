import { TestBed } from "@angular/core/testing";
import { Action, NgxsModule, State, StateContext, Store } from "@ngxs/store";
import { of } from "rxjs";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

import { NgxsAsyncStoragePluginModule } from "./async-storage.module";

class Increment {
	static type = "INCREMENT";
}

class Decrement {
	static type = "DECREMENT";
}

interface StateModel {
	count: number;
}

@State<StateModel>({
	name: "counter",
	defaults: { count: 0 },
})
class MyStore {
	@Action(Increment)
	increment({ getState, setState }: StateContext<StateModel>) {
		setState({
			count: Number(getState().count) + 1,
		});
	}

	@Action(Decrement)
	decrement({ getState, setState }: StateContext<StateModel>) {
		setState({
			count: Number(getState().count) - 1,
		});
	}
}

describe("Async Storage Plugin", () => {
	const asyncStorageServiceSpy = {
		getItem: () => of(`{"count":15}`),
		setItem: jasmine.createSpy(),
	};
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				NgxsModule.forRoot([MyStore]),
				NgxsAsyncStoragePluginModule.forRoot({
					keys: ["counter"],
				}),
			],
			providers: [
				{
					provide: AsyncStorageService,
					useValue: asyncStorageServiceSpy,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should rehydrate", () => {
		store
			.select((state: any) => state.counter)
			.subscribe((state: StateModel) => {
				expect(state.count).toBe(15);
			});
	});

	it("should store items", () => {
		store.dispatch(new Increment());
		store.dispatch(new Increment());
		store.dispatch(new Increment());
		expect(asyncStorageServiceSpy.setItem).toHaveBeenCalledTimes(3);
	});
});
