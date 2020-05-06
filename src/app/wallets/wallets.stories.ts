import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card/wallet-card.component";
import { WalletsEmptyListComponent } from "./wallets-empty-list/wallets-empty-list.component";

storiesOf("Wallets", module)
	.addDecorator(
		moduleMetadata({
			declarations: [WalletsEmptyListComponent, WalletCardComponent],
			imports: [TranslateModule, IonicModule, PipesModule],
		}),
	)
	.add("Empty List", () => ({
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
	}))
	.add("Wallet Card", () => ({
		component: WalletCardComponent,
		props: {
			address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
			name: "ARK Ecosystem",
			balance: "20000",
			symbol: "ark",
		},
		template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-card [name]="name" [balance]="balance" [symbol]="symbol" [address]="address"></wallet-card>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Wallet Card Alt Coin", () => ({
		component: WalletCardComponent,
		props: {
			address: "AdS7WvzqusoP759qRo6HDmUz2L34u4fMHz",
			name: "Bitcoin",
			balance: "20000",
			symbol: "btc",
		},
		template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-card [name]="name" [balance]="balance" [symbol]="symbol" [address]="address"></wallet-card>
				</ion-content>
			</ion-app>
		`,
	}));
