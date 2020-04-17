import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	exports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
	],
})
export class SharedModule {}
