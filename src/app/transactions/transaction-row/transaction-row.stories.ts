import { IonicModule } from "@ionic/angular";
// import { action } from "@storybook/addon-actions";
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
		transaction: {
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
			amount: text("Amount", "1924098349979836"),
		},
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<transaction-row
                        [transaction]="transaction">
                    </transaction-row>
				</ion-content>
			</ion-app>
		`,
});

TransactionRowStory.story = {
	name: "transaction-row",
};
