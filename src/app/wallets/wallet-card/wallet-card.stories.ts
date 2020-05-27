import { IonicModule } from "@ionic/angular";
import { action } from "@storybook/addon-actions";
import { select, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card.component";

export default {
	title: "Components / Wallet Card",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WalletCardComponent],
			imports: [IonicModule, PipesModule],
		}),
	],
};

export const WalletCardArk = () => ({
	component: WalletCardComponent,
	props: {
		openWalletClick: action("Open wallet click"),
		address: text("Address", "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9"),
		name: text("Name", "ARK Ecosystem"),
		balance: text("Balance", "20000"),
		currency: select("Coin", { ARK: "ARK", Bitcoin: "BTC" }, "ARK"),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-card [name]="name" [balance]="balance" [currency]="currency" [address]="address" (openWalletClick)="openWalletClick(address)"></wallet-card>
				</ion-content>
			</ion-app>
		`,
});

WalletCardArk.story = {
	name: "wallet-card",
};
