import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { WalletsEmptyListComponent } from "./wallets-empty-list.component";

storiesOf("wallets-empty-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [WalletsEmptyListComponent],
			imports: [TranslateModule, IonicModule],
		}),
	)
	.add("Default", () => ({
		component: WalletsEmptyListComponent,
		props: {
			importWalletClick: action("Import Button!"),
			generateWalletClick: action("Generate Button!"),
		},
		template: `
			<ion-app>
				<ion-content>
					<wallets-empty-list
						name="Caio"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallets-empty-list>
				</ion-content>
			</ion-app>
		`,
	}));
