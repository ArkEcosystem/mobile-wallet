import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { PasswordPageComponent } from "./password-page.component";
import { WordBoxComponentModule } from "./word-box/word-box.component.module";

@NgModule({
	declarations: [PasswordPageComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		WordBoxComponentModule,
		PipesModule,
	],
})
export class PasswordPageModule {}
