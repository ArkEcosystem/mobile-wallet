import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";
import { InputFeeComponent } from "./input-fee.component";

@NgModule({
	declarations: [InputFeeComponent],
	imports: [
		IonicModule,
		SharedModule,
		InputCurrencyComponentModule,
		DirectivesModule,
		PipesModule,
	],
	exports: [InputFeeComponent],
})
export class InputFeeComponentModule {}
