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

import { EnterSecondPassphraseModal } from "../modals/enter-second-passphrase/enter-second-passphrase";
import { EnterSecondPassphraseModalModule } from "../modals/enter-second-passphrase/enter-second-passphrase.module";
import { WalletCardComponentModule } from "./wallet-card/wallet-card.component.module";
import { WalletsActionsComponentModule } from "./wallets-actions/wallets-actions.component.module";
import { WalletsEmptyListComponentModule } from "./wallets-empty-list/wallets-empty-list.module";
import { WalletsRoutingModule } from "./wallets-routing.module";
import { WalletsComponent } from "./wallets.component";

@NgModule({
	declarations: [WalletsComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		PipesModule,
		WalletsEmptyListComponentModule,
		WalletsActionsComponentModule,
		WalletCardComponentModule,
		ChartsModule,
		DirectivesModule,
		WalletsRoutingModule,
		GenerateEntropyModalModule,
		WalletBackupModalModule,
		EnterSecondPassphraseModalModule,
	],
	entryComponents: [
		GenerateEntropyModal,
		WalletBackupModal,
		EnterSecondPassphraseModal,
	],
})
export class WalletsComponentModule {}
