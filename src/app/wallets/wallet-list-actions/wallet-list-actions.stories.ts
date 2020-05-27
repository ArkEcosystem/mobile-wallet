import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata } from "@storybook/angular";

import { WalletListActionsComponent } from "./wallet-list-actions.component";

export default {
	title: "Components / Wallet List Actions",
	decorators: [
		moduleMetadata({
			declarations: [WalletListActionsComponent],
			imports: [IonicModule, TranslateModule, CommonModule],
		}),
	],
};

export const WalletListActions = () => ({
	component: WalletListActionsComponent,
	props: {
		importWalletClick: action("Import Button!"),
		generateWalletClick: action("Generate Button!"),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<wallet-list-actions
                        (importWalletClick)="importWalletClick()"
                        (generateWalletClick)="generateWalletClick()">
                    </wallet-list-actions>
				</ion-content>
			</ion-app>
		`,
});

WalletListActions.story = {
	name: "wallet-list-actions",
};
