import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { select, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponentModule } from "../wallet-card/wallet-card.component.module";
import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListEmptyComponentModule } from "../wallet-list-empty/wallet-list-empty.component.module";
import { WalletListHeaderComponentModule } from "../wallet-list-header/wallet-list-header.component.module";
import { WalletListComponent } from "./wallet-list.component";

export default {
	title: "Modules / Wallet List",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WalletListComponent],
			imports: [
				IonicModule,
				CommonModule,
				TranslateModule,
				PipesModule,
				WalletListActionsComponentModule,
				WalletListEmptyComponentModule,
				WalletListActionsComponentModule,
				WalletListHeaderComponentModule,
				WalletCardComponentModule,
			],
		}),
	],
};

const wallets = [{}, {}];

export const WalletList = () => ({
	component: WalletListComponent,
	props: {
		name: text("User name", "Caio"),
		currencySymbol: text("Currency Symbol", "$"),
		totalBalance: text("Total balance", "9999999"),
		headerOrientation: select(
			"Header Orientation",
			{ vertical: "vertical", horizontal: "horizontal" },
			"vertical",
		),
		importWalletClick: action("Import Button!"),
		generateWalletClick: action("Generate Button!"),
		wallets,
	},
	template: `
			<ion-app>
				<ion-content>
					<wallet-list
						[name]="name"
						[headerOrientation]="headerOrientation"
						[currencySymbol]="currencySymbol"
						[totalBalance]="totalBalance"
						[wallets]="wallets"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallet-list>
				</ion-content>
			</ion-app>
		`,
});

WalletList.story = {
	name: "wallet-list",
};
