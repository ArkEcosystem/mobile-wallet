import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { WalletBackupModal } from "./wallet-backup";

import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PassphraseWordTesterModal } from "../passphrase-word-tester/passphrase-word-tester";
import { PassphraseWordTesterModalModule } from "../passphrase-word-tester/passphrase-word-tester.module";

@NgModule({
	declarations: [WalletBackupModal],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		QRCodeComponentModule,
		PassphraseWordTesterModalModule,
	],
	entryComponents: [PassphraseWordTesterModal],
	exports: [WalletBackupModal],
})
export class WalletBackupModalModule {}
