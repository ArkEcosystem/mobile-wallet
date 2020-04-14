import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

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
	],
})
export class WalletImportPageModule {}
