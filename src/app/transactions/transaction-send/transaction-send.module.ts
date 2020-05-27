import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
import { TransactionSendComponent } from "./transaction-send.component";

@NgModule({
	declarations: [TransactionSendComponent],
	imports: [
		IonicModule,
		PipesModule,
		RecipientListResumeComponentModule,
		InputAddressComponentModule,
		InputCurrencyComponentModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [TransactionSendComponent],
})
export class TransactioSendModule {}
