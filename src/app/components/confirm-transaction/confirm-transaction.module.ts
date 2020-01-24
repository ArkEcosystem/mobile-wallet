import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ConfirmTransactionComponent } from "./confirm-transaction";

import { ConfirmTransactionModal } from "@/app/modals/confirm-transaction/confirm-transaction";
import { ConfirmTransactionModalModule } from "@/app/modals/confirm-transaction/confirm-transaction.module";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

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
