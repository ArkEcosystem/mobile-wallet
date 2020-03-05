import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts";

import { GenerateEntropyModal } from "@/app/modals/generate-entropy/generate-entropy";
import { GenerateEntropyModalModule } from "@/app/modals/generate-entropy/generate-entropy.module";
import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import { WalletBackupModalModule } from "@/app/modals/wallet-backup/wallet-backup.module";
import { EmptyListComponentModule } from "@/components/empty-list/empty-list.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletListPage } from "./wallet-list";

@NgModule({
	declarations: [WalletListPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: WalletListPage }]),
		TranslateModule,
		PipesModule,
		EmptyListComponentModule,
		ChartsModule,
		DirectivesModule,
		GenerateEntropyModalModule,
		WalletBackupModalModule,
	],
	entryComponents: [GenerateEntropyModal, WalletBackupModal],
})
export class WalletListPageModule {}
