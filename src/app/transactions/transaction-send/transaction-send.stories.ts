import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
// import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata } from "@storybook/angular";

import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
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
				InputAddressComponentModule,
				InputCurrencyComponentModule,
				FormsModule,
				ReactiveFormsModule,
			],
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
