import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { QRScannerModal } from "@/app/modals/qr-scanner/qr-scanner";
import { QRScannerModalModule } from "@/app/modals/qr-scanner/qr-scanner.module";

import { QRScannerComponent } from "./qr-scanner";

@NgModule({
	declarations: [QRScannerComponent],
	imports: [IonicModule, CommonModule, QRScannerModalModule],
	entryComponents: [QRScannerModal],
	exports: [QRScannerComponent],
})
export class QRScannerComponentModule {}
