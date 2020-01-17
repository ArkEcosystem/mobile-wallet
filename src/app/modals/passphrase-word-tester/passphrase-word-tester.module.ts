import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PassphraseInputComponentModule } from "@/components/passphrase-input/passphrase-input.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
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
