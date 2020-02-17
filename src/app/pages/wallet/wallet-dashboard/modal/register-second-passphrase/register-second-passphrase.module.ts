import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RegisterSecondPassphrasePage } from "./register-second-passphrase";

import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [RegisterSecondPassphrasePage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		DirectivesModule,
		TranslateModule,
		PipesModule,
	],
	exports: [RegisterSecondPassphrasePage],
})
export class RegisterSecondPassphrasePageModule {}
