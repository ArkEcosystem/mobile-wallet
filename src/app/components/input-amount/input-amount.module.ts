import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { InputAmountComponent } from "@/components/input-amount/input-amount.component";
import { DirectivesModule } from "@/directives/directives.module";

import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";

@NgModule({
	declarations: [InputAmountComponent],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		InputCurrencyComponentModule,
		ReactiveFormsModule,
		DirectivesModule,
		CommonModule,
	],
	exports: [InputAmountComponent],
})
export class InputAmountComponentModule {}
