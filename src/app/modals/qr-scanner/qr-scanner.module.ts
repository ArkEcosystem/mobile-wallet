import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { QRScannerModal } from "./qr-scanner";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [QRScannerModal],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		ClosePopupComponentModule,
	],
	exports: [QRScannerModal],
})
export class QRScannerModalModule {}
