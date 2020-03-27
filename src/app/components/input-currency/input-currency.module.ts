import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";

import { InputCurrencyComponent } from "./input-currency.component";

@NgModule({
	declarations: [InputCurrencyComponent],
	imports: [IonicModule, SharedModule, DirectivesModule],
	exports: [InputCurrencyComponent],
})
export class InputCurrencyComponentModule {}
