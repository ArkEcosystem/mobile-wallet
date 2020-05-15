import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponent } from "./transaction-row.component";

describe("Transaction Row", () => {
	let spectator: SpectatorHost<TransactionRowComponent>;
	const createHost = createHostComponentFactory({
		component: TransactionRowComponent,
		imports: [PipesModule],
	});

	it("should create a sent transaction", () => {
		spectator = createHost(
			`<transaction-row
                [transaction]="transaction"
                (openTransactionDetails)="openTransactionDetails(transaction.id)">
            </transaction-row>`,
			{
				hostProps: {
					transaction: {
						id:
							"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
						type: "sent",

						method: "regular",

						address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
						timestamp: "1583335576",
						amount: "2239907700",
					},
				},
			},
		);
		const component = spectator.query(byTestId("transaction-row__type"));
		expect(component).toHaveClass("sent");
	});

	it("should create a received transaction", () => {
		spectator = createHost(
			`<transaction-row
                [transaction]="transaction"
                (openTransactionDetails)="openTransactionDetails(transaction.id)">
            </transaction-row>`,
			{
				hostProps: {
					transaction: {
						id:
							"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
						type: "received",

						method: "regular",

						address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
						timestamp: "1583335576",
						amount: "2239907700",
					},
				},
			},
		);
		const component = spectator.query(byTestId("transaction-row__type"));
		expect(component).toHaveClass("received");
	});

	it("should emit redirect to details when tapped", () => {
		spectator = createHost(
			`<transaction-row
                [transaction]="transaction"
                (openTransactionDetails)="openTransactionDetails(transaction.id)">
            </transaction-row>`,
			{
				hostProps: {
					transaction: {
						id:
							"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
						type: "sent",

						method: "regular",

						address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
						timestamp: "1583335576",
						amount: "2239907700",
					},
				},
			},
		);

		let output: any;
		spectator
			.output("openTransactionDetails")
			.subscribe((id) => (output = id));

		const detailsAction = spectator.query(byTestId("transaction-row"));

		spectator.click(detailsAction);

		expect(output).toBe(
			"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
		);
	});
});
