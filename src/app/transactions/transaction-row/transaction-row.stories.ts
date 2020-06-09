import { IonicModule } from "@ionic/angular";
import { action } from "@storybook/addon-actions";
import { select, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponent } from "./transaction-row.component";

export default {
	title: "Components / Transaction Row",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [TransactionRowComponent],
			imports: [IonicModule, PipesModule],
		}),
	],
};

export const TransactionRowStory = () => ({
	component: TransactionRowComponent,
	props: {
		openTransactionDetails: action("Open transaction details"),
		transaction: {
			id:
				"3e0e5e79954494f02627fbfe56a90af472e67f248b25104bd9dd3fbb3db6801f",
			type: select(
				"Type",
				{
					Sent: "sent",
					Received: "received",
				},
				"sent",
			),
			method: select(
				"Method",
				{
					Multipayment: "multipayment",
					Regular: "regular",
				},
				"regular",
			),
			address: text("Address", "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9"),
			timestamp: text("Transaction Timestamp", "1583335576"),
			amount: text("Amount", "2239907700"),
		},
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<transaction-row
                        [transaction]="transaction"
                        (openTransactionDetails)="openTransactionDetails(transaction.id)">
                    </transaction-row>
				</ion-content>
			</ion-app>
		`,
});

TransactionRowStory.story = {
	name: "transaction-row",
};
