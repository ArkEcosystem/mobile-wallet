import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";

import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";
import { InputFeeComponent } from "./input-fee.component";

@NgModule({
	declarations: [InputFeeComponent],
	imports: [
		IonicModule,
		SharedModule,
		InputCurrencyComponentModule,
		DirectivesModule,
	],
	exports: [InputFeeComponent],
})
export class InputFeeComponentModule {}
