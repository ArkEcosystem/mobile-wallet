import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";

import { removeLogs, sleep } from "@@/test/helpers";

import { TransactionFormState } from "../../shared/transaction-form-state/transaction-form.state";
import { TransactionState } from "../../shared/transaction.state";
import { TransactionVoteComponent } from "../transaction-vote.component";
import { TransactionVoteController } from "./transaction-vote.controller";
import { TransactionVoteType } from "./transaction-vote.types";

const delegate = {
	username: "test",
	publicKey: "testing",
	rank: 1,
};

@Component({
	selector: "test-transaction-vote",
	template: `<button (click)="vote()">Open</button>`,
})
export class TestTransactionVoteController {
	public finished = false;

	constructor(private transactionVoteCtrl: TransactionVoteController) {}

	public vote() {
		this.transactionVoteCtrl
			.open({
				delegate,
				voteType: TransactionVoteType.Vote,
			})
			.subscribe({
				complete: () => (this.finished = true),
			});
	}
}

describe("Transaction Vote Controller", () => {
	let spectator: SpectatorHost<TestTransactionVoteController>;

	const createHost = createHostFactory({
		component: TestTransactionVoteController,
		declarations: [TransactionVoteComponent],
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([TransactionState, TransactionFormState]),
		],
		providers: [TransactionVoteController],
	});

	beforeAll(() => removeLogs());

	it("should open modal and end observable when closing", async () => {
		spectator = createHost(
			`<test-transaction-vote></test-transaction-vote>`,
		);
		const button = spectator.query("button");
		spectator.click(button);

		const store = spectator.get(Store);
		const state = store.selectSnapshot((state) => state.transaction.form);
		expect(state.amount).toBe("0");

		await sleep(300);
		const modalElement: HTMLIonModalElement = spectator.query(
			".transaction-vote-modal",
			{
				root: true,
			},
		);
		expect(modalElement).toBeVisible();

		await modalElement.dismiss();
		expect(spectator.component.finished).toBeTrue();
	});
});
