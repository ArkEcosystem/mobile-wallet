import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RegisterDelegatePage } from "./register-delegate";

import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [RegisterDelegatePage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		DirectivesModule,
		TranslateModule,
		PipesModule,
		InputFeeComponentModule,
	],
	exports: [RegisterDelegatePage],
})
export class RegisterDelegatePageModule {}
