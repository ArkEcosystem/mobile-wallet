import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransactionSendPage } from "./transaction-send";

import { ConfirmTransactionComponentModule } from "@/components/confirm-transaction/confirm-transaction.module";
import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { PipesModule } from "@/pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";

import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputAmountComponentModule } from "@/components/input-amount/input-amount.module";
import { WalletPickerModalModule } from "@/components/wallet-picker/wallet-picker.modal.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

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
