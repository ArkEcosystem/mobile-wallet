import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { ConfirmTransactionModal } from "./confirm-transaction";

@NgModule({
	declarations: [ConfirmTransactionModal],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		PipesModule,
		ClosePopupComponentModule,
		DirectivesModule,
	],
	exports: [ConfirmTransactionModal],
})
export class ConfirmTransactionModalModule {}
