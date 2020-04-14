import { NgModule } from "@angular/core";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";

import { AddressListComponentModule } from "./address-list/address-list.module";
import { ClosePopupComponentModule } from "./close-popup/close-popup.module";
import { EmptyListComponentModule } from "./empty-list/empty-list.module";
import { ProgressBarComponent } from "./progress-bar/progress-bar";

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [],
	exports: [
		ProgressBarComponent,
		EmptyListComponentModule,
		ConfirmTransactionComponentModule,
		ClosePopupComponentModule,
		AddressListComponentModule,
	],
})
export class ComponentsModule {}
