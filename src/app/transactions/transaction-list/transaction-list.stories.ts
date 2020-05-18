import { IonicModule } from "@ionic/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponentModule } from "../transaction-row/transaction-row.component.module";
import { TransactionListComponent } from "./transaction-list.component";

export default {
	title: "Components / Transaction List",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [TransactionListComponent],
			imports: [IonicModule, PipesModule, TransactionRowComponentModule],
		}),
	],
};

export const TransactionList = () => ({
	component: TransactionListComponent,
	props: {
		// openTransactionDetails: action("Open transaction details"),
		// transaction: {
		// 	id:
		// 		"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
		// 	type: select(
		// 		"Type",
		// 		{
		// 			Sent: "sent",
		// 			Received: "received",
		// 		},
		// 		"sent",
		// 	),
		// 	method: select(
		// 		"Method",
		// 		{
		// 			Multipayment: "multipayment",
		// 			Regular: "regular",
		// 		},
		// 		"regular",
		// 	),
		// 	address: text("Address", "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9"),
		// 	timestamp: text("Transaction Timestamp", "1583335576"),
		// 	amount: text("Amount", "2239907700"),
		// },
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<transaction-list></transaction-list>
				</ion-content>
			</ion-app>
		`,
});

TransactionList.story = {
	name: "transaction-list",
};
