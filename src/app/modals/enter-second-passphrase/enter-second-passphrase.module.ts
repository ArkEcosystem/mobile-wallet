import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ClosePopupComponentModule } from "@/components/close-popup/close-popup.module";
import { DirectivesModule } from "@/directives/directives.module";

import { EnterSecondPassphraseModal } from "./enter-second-passphrase";

@NgModule({
	declarations: [EnterSecondPassphraseModal],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		DirectivesModule,
		TranslateModule,
		ClosePopupComponentModule,
	],
	exports: [EnterSecondPassphraseModal],
})
export class EnterSecondPassphraseModalModule {}
