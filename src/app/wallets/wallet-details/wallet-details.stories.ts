import { IonicModule } from "@ionic/angular";
// import { action } from "@storybook/addon-actions";
import { select, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletDetailsComponent } from "./wallet-details.component";

export default {
	title: "Modules / Wallet Details",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WalletDetailsComponent],
			imports: [
				IonicModule,
				PipesModule,
				BottomDrawerComponentModule,
				IdenticonComponentModule,
			],
		}),
	],
};

export const WalletDetails = () => ({
	component: WalletDetailsComponent,
	props: {
		address: text("Address", "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9"),
		balance: text("Balance", "20000"),
		currency: select("Coin", { ARK: "ARK", Bitcoin: "BTC" }, "ARK"),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-details [balance]="balance" [currency]="currency" [address]="address" ></wallet-details>
				</ion-content>
			</ion-app>
		`,
});

WalletDetails.story = {
	name: "wallet-details",
};
