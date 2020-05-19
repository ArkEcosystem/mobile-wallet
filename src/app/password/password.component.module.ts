import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { PasswordComponent } from "./password.component";
import { WordBoxComponentModule } from "./word-box/word-box.component.module";

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
