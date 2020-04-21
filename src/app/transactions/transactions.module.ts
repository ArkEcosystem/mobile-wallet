import { NgModule } from "@angular/core";

import { TransactionVoteModule } from "./transaction-vote/transaction-vote.module";

@NgModule({
	imports: [TransactionVoteModule],
	exports: [],
	providers: [],
})
export class TransactionsModule {}
