import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { PinCodeComponent } from "./pin-code";

import { EnterSecondPassphraseModal } from "@/app/modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "@/app/modals/enter-second-passphrase/enter-second-passphrase.module";
import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { PinCodeModalModule } from "@/app/modals/pin-code/pin-code.module";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ClosePopupComponentModule } from "../close-popup/close-popup.module";

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
