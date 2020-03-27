import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PassphraseInputComponentModule } from "@/components/passphrase-input/passphrase-input.module";

import { PassphraseWordTesterModal } from "./passphrase-word-tester";

@NgModule({
	declarations: [PassphraseWordTesterModal],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		PassphraseInputComponentModule,
	],
	exports: [PassphraseWordTesterModal],
})
export class PassphraseWordTesterModalModule {}
