import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { EnterSecondPassphraseModal } from "@/app/modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "@/app/modals/enter-second-passphrase/enter-second-passphrase.module";
import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";

import { ClosePopupComponentModule } from "../close-popup/close-popup.module";
import { PinCodeComponent } from "./pin-code";

@NgModule({
	declarations: [PinCodeComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		ClosePopupComponentModule,
		PinCodeModalModule,
		EnterSecondPassphraseModalModule,
	],
	exports: [PinCodeComponent],
	entryComponents: [PinCodeModal, EnterSecondPassphraseModal],
})
export class PinCodeComponentModule {}
