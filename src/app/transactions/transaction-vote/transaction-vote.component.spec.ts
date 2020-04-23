import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { sleep } from "@@/test/helpers";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";

import { TransactionVoteComponent } from "./transaction-vote.component";

describe("Transaction Vote", () => {
	let spectator: Spectator<TransactionVoteComponent>;
	const createHost = createHostComponentFactory({
		component: TransactionVoteComponent,
		imports: [
			InputFeeComponentModule,
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<transaction-vote [delegate]="delegate" voteType="-"></transaction-vote>`,
			{
				hostProps: {
					delegate: {
						username: "test1",
					},
				},
			},
		);
		const delegate = spectator.query(
			byTestId("transaction-vote__delegate"),
		);
		const button = spectator.query(byTestId("transaction-vote__button"));
		expect(delegate).toHaveText("test1");
		expect(button).toHaveText("DELEGATES_PAGE.UNVOTE");
	});

	it("should output data", async () => {
		const delegate = {
			username: "test1",
		};
		spectator = createHost(
			`<transaction-vote [delegate]="delegate" voteType="+"></transaction-vote>`,
			{
				hostProps: {
					delegate,
				},
			},
		);
		const button = spectator.query(byTestId("transaction-vote__button"));
		await sleep(10);

		let output: any;
		spectator
			.output("transactionVoteClick")
			.subscribe((value) => (output = value));
		spectator.click(button);

		expect(output).toEqual({
			delegate,
			fee: "1",
			voteType: "+",
		});
	});
});
