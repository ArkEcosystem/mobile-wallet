import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";

import { SetLabelPage } from "./set-label";

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
