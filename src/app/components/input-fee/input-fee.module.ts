import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";
import { InputFeeComponent } from "./input-fee.component";

@NgModule({
	declarations: [InputFeeComponent],
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		InputCurrencyComponentModule,
		TranslateModule,
		CommonModule,
	],
	exports: [InputFeeComponent],
})
export class InputFeeComponentModule {}
