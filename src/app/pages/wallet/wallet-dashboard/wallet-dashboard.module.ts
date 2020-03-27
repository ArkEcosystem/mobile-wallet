import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import { WalletBackupModalModule } from "@/app/modals/wallet-backup/wallet-backup.module";
import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { SetLabelPage } from "./modal/set-label/set-label";
import { SetLabelPageModule } from "./modal/set-label/set-label.module";
import { WalletDashboardPage } from "./wallet-dashboard";

@NgModule({
	declarations: [WalletDashboardPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: WalletDashboardPage }]),
		TranslateModule,
		PipesModule,
		PinCodeComponentModule,
		ConfirmTransactionComponentModule,
		DirectivesModule,
		SetLabelPageModule,
		WalletBackupModalModule,
	],
	entryComponents: [SetLabelPage, WalletBackupModal],
})
export class WalletDashboardPageModule {}
