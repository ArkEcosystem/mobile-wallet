import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";

import { TransactionFormActions } from "./transaction-form-state/transaction-form.actions";
import { TransactionFormState } from "./transaction-form-state/transaction-form.state";
import { TransactionState } from "./transaction.state";

describe("Transaction State", () => {
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				NgxsModule.forRoot([TransactionState, TransactionFormState]),
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot((state) => state.transaction);
		expect(state).toEqual({
			form: {},
		});
	});

	it("should start form", () => {
		store.dispatch(
			new TransactionFormActions.Start({
				asset: { vendorField: "test" },
			}),
		);
		const state = store.selectSnapshot((state) => state.transaction);
		expect(state).toEqual({
			form: {
				amount: "0",
				asset: {
					vendorField: "test",
				},
				fee: "0",
				id: undefined,
				nonce: "1",
				recipient: undefined,
				sender: undefined,
				signature: undefined,
			},
		});
	});

	it("should update form", () => {
		store.dispatch(
			new TransactionFormActions.Start({
				asset: { vendorField: "test" },
			}),
		);
		store.dispatch(
			new TransactionFormActions.Update({
				recipient: "abc",
			}),
		);
		const state = store.selectSnapshot((state) => state.transaction);
		expect(state).toEqual({
			form: {
				amount: "0",
				asset: {
					vendorField: "test",
				},
				fee: "0",
				id: undefined,
				nonce: "1",
				recipient: "abc",
				sender: undefined,
				signature: undefined,
			},
		});
	});
});
