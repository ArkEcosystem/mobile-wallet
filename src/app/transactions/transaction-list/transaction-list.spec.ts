import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { newTransactions } from "@@/test/fixture/transactions.fixture";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponentModule } from "../transaction-row/transaction-row.component.module";
import { TransactionListComponent } from "./transaction-list.component";

describe("Transaction List", () => {
	let spectator: SpectatorHost<TransactionListComponent>;
	const createHost = createHostComponentFactory({
		component: TransactionListComponent,
		imports: [PipesModule, TransactionRowComponentModule],
	});

	it("should create", () => {
		spectator = createHost(
			`<transaction-list [transactions]="transactions"></transaction-list>`,
			{
				hostProps: {
					transactions: newTransactions,
				},
			},
		);
		const component = spectator.query(byTestId("transaction-list"));
		expect(component).toBeTruthy();
	});

	it("should render empty list", () => {
		spectator = createHost(`<transaction-list></transaction-list>`);
		const component = spectator.query(byTestId("transaction-list--empty"));
		expect(component).toBeTruthy();
	});
});
