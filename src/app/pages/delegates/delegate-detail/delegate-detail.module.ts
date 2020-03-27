import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { PipesModule } from "@/pipes/pipes.module";

import { DelegateDetailPage } from "./delegate-detail";

@NgModule({
	declarations: [DelegateDetailPage],
	imports: [
		IonicModule,
		SharedModule,
		QRCodeComponentModule,
		PipesModule,
		ClosePopupComponentModule,
		InputFeeComponentModule,
	],
	exports: [DelegateDetailPage],
})
export class DelegateDetailPageModule {}
