import { NgModule } from "@angular/core";

import { EnterSecondPassphraseModal } from "../modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "../modals/enter-second-passphrase/enter-second-passphrase.module";

@NgModule({
	imports: [EnterSecondPassphraseModalModule],
	entryComponents: [EnterSecondPassphraseModal],
})
export class WalletModule {}
