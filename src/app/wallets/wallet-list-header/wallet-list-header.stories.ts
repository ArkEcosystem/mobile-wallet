import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { select, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletListActionsComponent } from "../wallet-list-actions/wallet-list-actions.component";
import { WalletListHeaderComponent } from "./wallet-list-header.component";

export default {
	title: "Components / Wallet List Header",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [
				WalletListHeaderComponent,
				WalletListActionsComponent,
			],
			imports: [TranslateModule, IonicModule, PipesModule],
		}),
	],
};

export const WalletListHeaderVertical = () => ({
	component: WalletListHeaderComponent,
	props: {
		importWalletClick: action("Import Button!"),
		generateWalletClick: action("Generate Button!"),
		name: text("User name", "Caio"),
		currencySymbol: text("Currency Symbol", "$"),
		totalBalance: text("Total balance", "200000000"),
		orientation: select(
			"Orientation",
			{ vertical: "vertical", horizontal: "horizontal" },
			"vertical",
		),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<wallet-list-header
						[name]="name"
						[orientation]="orientation"
						[currencySymbol]="currencySymbol"
						[totalBalance]="totalBalance"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallet-list-header>
				</ion-content>
			</ion-app>
		`,
});

WalletListHeaderVertical.story = {
	name: "wallet-list-header",
};
