import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DelegateDetailPage } from "./delegate-detail";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { PipesModule } from "@/pipes/pipes.module";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [DelegateDetailPage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		TranslateModule,
		QRCodeComponentModule,
		PipesModule,
		ClosePopupComponentModule,
		InputFeeComponentModule,
	],
	exports: [DelegateDetailPage],
})
export class DelegateDetailPageModule {}
