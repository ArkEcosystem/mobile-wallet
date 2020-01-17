import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { DelegatesPage } from "./delegates";

import { PipesModule } from "@/pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPipeModule } from "ngx-filter-pipe";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { FormsModule } from "@angular/forms";
import { DelegateDetailPage } from "./delegate-detail/delegate-detail";
import { DelegateDetailPageModule } from "./delegate-detail/delegate-detail.module";

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
