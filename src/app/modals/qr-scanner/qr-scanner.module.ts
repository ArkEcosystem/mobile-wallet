import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";

import { QRScannerModal } from "./qr-scanner";

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
