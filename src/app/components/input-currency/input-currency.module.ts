import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { InputCurrencyComponent } from "./input-currency.component";

@NgModule({
	declarations: [InputCurrencyComponent],
	imports: [IonicModule, ReactiveFormsModule, SharedModule],
	exports: [InputCurrencyComponent],
})
export class InputCurrencyComponentModule {}
