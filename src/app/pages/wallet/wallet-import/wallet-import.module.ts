import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { WalletImportPage } from "./wallet-import";

import { TranslateModule } from "@ngx-translate/core";

import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

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
