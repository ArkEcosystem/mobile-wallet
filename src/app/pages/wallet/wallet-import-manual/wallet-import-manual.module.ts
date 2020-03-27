import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletManualImportPage } from "./wallet-import-manual";

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
