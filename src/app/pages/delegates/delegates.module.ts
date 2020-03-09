import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPipeModule } from "ngx-filter-pipe";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { PipesModule } from "@/pipes/pipes.module";

import { DelegateDetailPage } from "./delegate-detail/delegate-detail";
import { DelegateDetailPageModule } from "./delegate-detail/delegate-detail.module";
import { DelegatesPage } from "./delegates";

@NgModule({
	declarations: [DelegatesPage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: DelegatesPage }]),
		TranslateModule,
		PipesModule,
		FilterPipeModule,
		PinCodeComponentModule,
		ConfirmTransactionComponentModule,
		DelegateDetailPageModule,
	],
	entryComponents: [DelegateDetailPage],
})
export class DelegatesPageModule {}
