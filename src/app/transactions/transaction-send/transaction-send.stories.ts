import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
// import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata } from "@storybook/angular";

import { AddressValidator } from "@/app/validators/address/address";
import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { WalletPickerModalModule } from "@/components/wallet-picker/wallet-picker.modal.module";
import { PipesModule } from "@/pipes/pipes.module";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
import { RecipientListComponentModule } from "./recipient-list/recipient-list.component.module";
import { TransactionSendComponent } from "./transaction-send.component";

export default {
	title: "Modules / Transaction Send",
	decorators: [
		moduleMetadata({
			declarations: [TransactionSendComponent],
			imports: [
				// TranslateModule,
				IonicModule,
				PipesModule,
				RecipientListResumeComponentModule,
				RecipientListComponentModule,
				InputAddressComponentModule,
				InputCurrencyComponentModule,
				BottomDrawerComponentModule,
				FormsModule,
				ReactiveFormsModule,
				QRScannerComponentModule,
				WalletPickerModalModule,
			],
			providers: [ToastProvider, AddressValidator, UserDataService],
		}),
	],
};

export const TransactionSend = () => ({
	component: TransactionSendComponent,
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<transaction-send></transaction-send>
				</ion-content>
			</ion-app>
		`,
});

TransactionSend.story = {
	name: "transaction-send",
};
