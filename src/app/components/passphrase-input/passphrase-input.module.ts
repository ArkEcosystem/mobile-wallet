import { PassphraseInputComponent } from "@/components/passphrase-input/passphrase-input";
import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [PassphraseInputComponent],
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		DirectivesModule,
		CommonModule,
		TranslateModule,
	],
	exports: [PassphraseInputComponent],
})
export class PassphraseInputComponentModule {}
