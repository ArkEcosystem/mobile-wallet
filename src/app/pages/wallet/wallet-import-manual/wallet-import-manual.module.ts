import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { WalletManualImportPage } from "./wallet-import-manual";

import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [WalletManualImportPage],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{ path: "", component: WalletManualImportPage },
		]),
		TranslateModule,
		DirectivesModule,
		PipesModule,
		PinCodeModalModule,
	],
	entryComponents: [PinCodeModal],
})
export class WalletManualImportPageModule {}
