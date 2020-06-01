import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { select, text, withKnobs } from "@storybook/addon-knobs";
// import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata } from "@storybook/angular";

import { AddressValidator } from "@/app/validators/address/address";
import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { PipesModule } from "@/pipes/pipes.module";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
import { RecipientListComponentModule } from "./recipient-list/recipient-list.component.module";
import { TransactionSendComponent } from "./transaction-send.component";

export default {
	title: "Modules / Transaction Send",
	decorators: [
		withKnobs,
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
			],
			providers: [AddressValidator, UserDataService],
		}),
	],
};

export const TransactionSend = () => ({
	component: TransactionSendComponent,
	props: {
		balance: text("Balance", "20000"),
		currency: select("Coin", { ARK: "ARK", Bitcoin: "BTC" }, "ARK"),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<transaction-send [balance]="balance" [currency]="currency"></transaction-send>
				</ion-content>
			</ion-app>
		`,
});

TransactionSend.story = {
	name: "transaction-send",
};
