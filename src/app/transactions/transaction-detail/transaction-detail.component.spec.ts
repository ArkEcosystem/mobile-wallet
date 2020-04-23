import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs } from "@@/test/helpers";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionPipe } from "../shared/transaction.pipe";
import { TransactionDetailComponent } from "./transaction-detail.component";

const transaction = {
	recipient: "abc",
	sender: "abc",
	amount: "2",
	fee: "1",
};

describe("Transaction Detail", () => {
	let spectator: SpectatorHost<TransactionDetailComponent>;
	const createHost = createHostComponentFactory({
		component: TransactionDetailComponent,
		declarations: [TransactionPipe],
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			IdenticonComponentModule,
			PipesModule,
		],
	});

	beforeAll(() => removeLogs());

	it("should show properties", () => {
		spectator = createHost(
			`<transaction-detail [transaction]="transaction"></transaction-detail>`,
			{
				hostProps: {
					transaction,
				},
			},
		);
		const totalAmount = spectator.query(
			byTestId("transaction__total-amount"),
		);
		const sender = spectator.query(byTestId("transaction__sender"));
		const recipient = spectator.query(byTestId("transaction__recipient"));
		const fee = spectator.query(byTestId("transaction__fee"));
		const amount = spectator.query(byTestId("transaction__amount"));
		expect(totalAmount).toHaveText("0.00000003");
		expect(sender).toHaveText(transaction.sender);
		expect(recipient).toHaveText(transaction.recipient);
		expect(fee).toHaveText("0.00000001");
		expect(amount).toHaveText("0.00000002");
	});
});
