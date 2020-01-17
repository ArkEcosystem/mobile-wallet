import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { InputFeeComponent } from "./input-fee";

@NgModule({
	declarations: [InputFeeComponent],
	imports: [IonicModule, FormsModule, TranslateModule, CommonModule],
	exports: [InputFeeComponent],
})
export class InputFeeComponentModule {}
