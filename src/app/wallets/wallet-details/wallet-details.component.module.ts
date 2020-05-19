import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { EnterSecondPassphraseModal } from "../../modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "../../modals/enter-second-passphrase/enter-second-passphrase.module";
import { TransactionListComponentModule } from "../../transactions/transaction-list/transaction-list.component.module";
import { WalletDetailsRoutingModule } from "./wallet-details-routing.module";
import { WalletDetailsComponent } from "./wallet-details.component";

@NgModule({
	declarations: [WalletDetailsComponent],
	imports: [
		IonicModule,
		CommonModule,
		PipesModule,
		TransactionListComponentModule,
		IdenticonComponentModule,
		EnterSecondPassphraseModalModule,
		WalletDetailsRoutingModule,
	],
	exports: [WalletDetailsComponent],
	entryComponents: [EnterSecondPassphraseModal],
})
export class WalletDetailsComponentModule {}
