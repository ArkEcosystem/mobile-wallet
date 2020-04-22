import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";

import { TransactionVoteController } from "./shared/transaction-vote.controller";
import { TransactionVoteType } from "./shared/transaction-vote.types";
import { TransactionVoteComponent } from "./transaction-vote.component";

@Component({
	selector: "test-transaction-vote",
	template: `<ion-button (click)="handleOpen()">Open</ion-button>`,
})
export class TestTransactionVoteController {
	constructor(private transactionVoteCtrl: TransactionVoteController) {}

	public handleOpen() {
		this.transactionVoteCtrl
			.open({
				delegate: {
					username: "test",
					rank: 1,
				},
				voteType: TransactionVoteType.Vote,
			})
			.subscribe();
	}
}

storiesOf("transaction-vote", module)
	.addDecorator(
		moduleMetadata({
			declarations: [
				TransactionVoteComponent,
				TestTransactionVoteController,
			],
			imports: [TranslateModule, IonicModule, InputFeeComponentModule],
			entryComponents: [TransactionVoteComponent],
		}),
	)
	.add("Default", () => ({
		component: TransactionVoteComponent,
		props: {
			delegate: {
				username: "test",
			},
		},
		template: `
			<ion-app>
				<ion-content>
					<transaction-vote [delegate]="delegate"></transaction-vote>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Controller", () => ({
		component: TestTransactionVoteController,
		template: `
			<ion-app>
				<ion-content>
					<test-transaction-vote></test-transaction-vote>
				</ion-content>
			</ion-app>
		`,
	}));
