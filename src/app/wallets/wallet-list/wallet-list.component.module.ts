import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts";

import { GenerateEntropyModal } from "@/app/modals/generate-entropy/generate-entropy";
import { GenerateEntropyModalModule } from "@/app/modals/generate-entropy/generate-entropy.module";
import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import { WalletBackupModalModule } from "@/app/modals/wallet-backup/wallet-backup.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { EnterSecondPassphraseModal } from "../../modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "../../modals/enter-second-passphrase/enter-second-passphrase.module";
import { WalletCardComponentModule } from "../wallet-card/wallet-card.component.module";
import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListEmptyComponentModule } from "../wallet-list-empty/wallet-list-empty.component.module";
import { WalletListHeaderComponentModule } from "../wallet-list-header/wallet-list-header.component.module";
import { WalletListComponentRoutingModule } from "./wallet-list-routing.module";
import { WalletListComponent } from "./wallet-list.component";

@NgModule({
	declarations: [WalletListComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		PipesModule,
		ChartsModule,
		DirectivesModule,
		GenerateEntropyModalModule,
		EnterSecondPassphraseModalModule,
		WalletBackupModalModule,
		WalletListEmptyComponentModule,
		WalletListActionsComponentModule,
		WalletListComponentRoutingModule,
		WalletListHeaderComponentModule,
		WalletCardComponentModule,
	],
	entryComponents: [
		GenerateEntropyModal,
		WalletBackupModal,
		EnterSecondPassphraseModal,
	],
	exports: [WalletListComponent],
})
export class WalletListComponentModule {}
