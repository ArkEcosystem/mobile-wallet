import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WordBoxComponentModule } from "@/components/word-box/word-box.component.module";
import { PipesModule } from "@/pipes/pipes.module";

import { PasswordComponent } from "./password.component";

@NgModule({
	declarations: [PasswordComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		WordBoxComponentModule,
		PipesModule,
	],
})
export class PasswordComponentModule {}
