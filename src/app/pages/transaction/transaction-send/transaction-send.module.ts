import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputAmountComponentModule } from "@/components/input-amount/input-amount.module";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { WalletPickerModalModule } from "@/components/wallet-picker/wallet-picker.modal.module";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionSendPage } from "./transaction-send";

@NgModule({
	declarations: [TransactionSendPage],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([{ path: "", component: TransactionSendPage }]),
		TranslateModule,
		PipesModule,
		PinCodeComponentModule,
		ConfirmTransactionComponentModule,
		QRScannerComponentModule,
		DirectivesModule,
		InputAmountComponentModule,
		InputFeeComponentModule,
		WalletPickerModalModule,
		InputAddressComponentModule,
	],
})
export class TransactionSendPageModule {}
