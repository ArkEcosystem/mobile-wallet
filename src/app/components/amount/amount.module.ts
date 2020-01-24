import { AmountComponent } from "@/components/amount/amount";
import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
	declarations: [AmountComponent],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		ReactiveFormsModule,
		DirectivesModule,
		CommonModule,
	],
	exports: [AmountComponent],
})
export class AmountComponentModule {}
