import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { TransactionFormState } from "./shared/transaction-form-state/transaction-form.state";
import { TransactionState } from "./shared/transaction.state";
import { TransactionVoteModule } from "./transaction-vote/transaction-vote.module";

@NgModule({
	imports: [
		TransactionVoteModule,
		NgxsModule.forFeature([TransactionState, TransactionFormState]),
	],
	exports: [],
	providers: [],
})
export class TransactionsModule {}
