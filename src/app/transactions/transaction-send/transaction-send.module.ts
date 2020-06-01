import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { WalletPickerModalModule } from "@/components/wallet-picker/wallet-picker.modal.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
import { RecipientListComponentModule } from "./recipient-list/recipient-list.component.module";
import { TransactionSendComponent } from "./transaction-send.component";

@NgModule({
	declarations: [TransactionSendComponent],
	imports: [
		IonicModule,
		PipesModule,
		RecipientListResumeComponentModule,
		RecipientListComponentModule,
		InputAddressComponentModule,
		InputCurrencyComponentModule,
		BottomDrawerComponentModule,
		FormsModule,
		ReactiveFormsModule,
		WalletPickerModalModule,
		QRScannerComponentModule,
	],
	exports: [TransactionSendComponent],
})
export class TransactionSendModule {}
