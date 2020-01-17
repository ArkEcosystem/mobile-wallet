import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { TopWalletDetailsPage } from "./top-wallet-details";

@NgModule({
	declarations: [TopWalletDetailsPage],
	imports: [
		IonicModule,
		CommonModule,
		ClosePopupComponentModule,
		QRCodeComponentModule,
		PipesModule,
		TranslateModule,
		DirectivesModule,
	],
	exports: [TopWalletDetailsPage],
})
export class TopWalletDetailsPageModule {}
