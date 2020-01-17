import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { WalletDashboardPage } from "./wallet-dashboard";

import { TranslateModule } from "@ngx-translate/core";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import { WalletBackupModalModule } from "@/app/modals/wallet-backup/wallet-backup.module";
import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { RegisterDelegatePage } from "./modal/register-delegate/register-delegate";
import { RegisterDelegatePageModule } from "./modal/register-delegate/register-delegate.module";
import { SetLabelPage } from "./modal/set-label/set-label";
import { SetLabelPageModule } from "./modal/set-label/set-label.module";

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
		RegisterDelegatePageModule,
		SetLabelPageModule,
		WalletBackupModalModule,
	],
	entryComponents: [RegisterDelegatePage, SetLabelPage, WalletBackupModal],
})
export class WalletDashboardPageModule {}
