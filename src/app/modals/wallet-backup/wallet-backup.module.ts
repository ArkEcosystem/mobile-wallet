import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";

import { PassphraseWordTesterModal } from "../passphrase-word-tester/passphrase-word-tester";
import { PassphraseWordTesterModalModule } from "../passphrase-word-tester/passphrase-word-tester.module";
import { WalletBackupModal } from "./wallet-backup";

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
