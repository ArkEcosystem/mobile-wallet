import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ConfirmTransactionModal } from "./confirm-transaction";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { PipesModule } from "@/pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";

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
