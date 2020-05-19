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
