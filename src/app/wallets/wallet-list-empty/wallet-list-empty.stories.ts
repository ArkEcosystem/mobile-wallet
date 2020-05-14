import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletListActionsComponent } from "../wallet-list-actions/wallet-list-actions.component";
import { WalletListEmptyComponent } from "./wallet-list-empty.component";

export default {
	title: "Modules / Wallet List Empty",
	decorators: [
		moduleMetadata({
			declarations: [
				WalletListEmptyComponent,
				WalletListActionsComponent,
			],
			imports: [TranslateModule, IonicModule, PipesModule],
		}),
	],
};

export const EmptyList = () => ({
	component: WalletListEmptyComponent,
	props: {
		importWalletClick: action("Import Button!"),
		generateWalletClick: action("Generate Button!"),
	},
	template: `
			<ion-app>
				<ion-content>
					<wallet-list-empty
						name="Caio"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallet-list-empty>
				</ion-content>
			</ion-app>
		`,
});

EmptyList.story = {
	name: "wallet-list-empty",
};
