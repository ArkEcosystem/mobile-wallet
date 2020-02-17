import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SetLabelPage } from "./set-label";

import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [SetLabelPage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		DirectivesModule,
		TranslateModule,
	],
	exports: [SetLabelPage],
})
export class SetLabelPageModule {}
