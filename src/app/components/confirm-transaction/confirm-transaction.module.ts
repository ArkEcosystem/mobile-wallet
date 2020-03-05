import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ConfirmTransactionModal } from "@/app/modals/confirm-transaction/confirm-transaction";
import { ConfirmTransactionModalModule } from "@/app/modals/confirm-transaction/confirm-transaction.module";

import { ConfirmTransactionComponent } from "./confirm-transaction";

@NgModule({
	declarations: [ConfirmTransactionComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		ConfirmTransactionModalModule,
	],
	entryComponents: [ConfirmTransactionModal],
	exports: [ConfirmTransactionComponent],
})
export class ConfirmTransactionComponentModule {}
