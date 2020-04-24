import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";

import { TransactionVoteComponent } from "./transaction-vote.component";

@NgModule({
	declarations: [TransactionVoteComponent],
	imports: [IonicModule, SharedModule, InputFeeComponentModule],
	exports: [TransactionVoteComponent],
	providers: [],
})
export class TransactionVoteModule {}
