import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletImportPage } from "./wallet-import";

@NgModule({
	declarations: [WalletImportPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: WalletImportPage }]),
		TranslateModule,
		QRScannerComponentModule,
		PipesModule,
		PinCodeModalModule,
	],
	entryComponents: [PinCodeModal],
})
export class WalletImportPageModule {}
