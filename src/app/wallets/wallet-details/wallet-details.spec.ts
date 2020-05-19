import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionListComponentModule } from "../../transactions/transaction-list/transaction-list.component.module";
import { WalletDetailsComponent } from "./wallet-details.component";

describe("Wallet Details", () => {
	let spectator: SpectatorHost<WalletDetailsComponent>;
	const createHost = createHostComponentFactory({
		component: WalletDetailsComponent,
		imports: [
			PipesModule,
			TransactionListComponentModule,
			IdenticonComponentModule,
		],
	});

	it("should create", () => {
		spectator = createHost(`<wallet-details></wallet-details>`, {
			hostProps: {
				address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
				balance: "20000",
				currency: "ARK",
				transactionsOpen: false,
			},
		});
		const component = spectator.query(byTestId("wallet-details"));
		expect(component).toBeTruthy();
	});

	it("should expand transaction list", () => {
		spectator = createHost(`<wallet-details></wallet-details>`, {
			hostProps: {
				address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
				balance: "20000",
				currency: "ARK",
				transactionsOpen: false,
			},
		});

		const transactionList = spectator.query(
			byTestId("wallet-details__transaction-list"),
		);

		spectator.dispatchTouchEvent(transactionList, "swipeup", 0, 100);
		expect(transactionList).toHaveClass("expanded");
	});
});
