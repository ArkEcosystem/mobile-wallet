import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionPipe } from "../shared/transaction.pipe";
import { TransactionDetailComponent } from "./transaction-detail.component";

const transaction = {
	amount: "12200",
	fee: "2",
	sender: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
	recipient: "AIJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
};
storiesOf("transaction-detail", module)
	.addDecorator(
		moduleMetadata({
			declarations: [TransactionDetailComponent, TransactionPipe],
			imports: [
				TranslateModule,
				IonicModule,
				PipesModule,
				IdenticonComponentModule,
			],
		}),
	)
	.add("Default", () => ({
		component: TransactionDetailComponent,
		props: {
			transaction,
		},
		template: `
			<ion-app>
				<ion-content>
					<div class="p-4">
						<transaction-detail class="p-4" [transaction]="transaction" token="ARK"></transaction-detail>
					</div>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Incoming", () => ({
		component: TransactionDetailComponent,
		props: {
			transaction: {
				...transaction,
				mode: "in",
			},
		},
		template: `
			<ion-app>
				<ion-content>
					<div class="p-4">
						<transaction-detail class="p-4" [transaction]="transaction" token="ARK"></transaction-detail>
					</div>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Outcoming", () => ({
		component: TransactionDetailComponent,
		props: {
			transaction: {
				...transaction,
				mode: "out",
			},
		},
		template: `
			<ion-app>
				<ion-content>
					<div class="p-4">
						<transaction-detail class="p-4" [transaction]="transaction" token="ARK"></transaction-detail>
					</div>
				</ion-content>
			</ion-app>
		`,
	}));
