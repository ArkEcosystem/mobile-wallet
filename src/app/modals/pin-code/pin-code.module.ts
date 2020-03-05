import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { PinCodeModal } from "./pin-code";

@NgModule({
	declarations: [PinCodeModal],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		ClosePopupComponentModule,
		DirectivesModule,
		PipesModule,
	],
	exports: [PinCodeModal],
})
export class PinCodeModalModule {}
