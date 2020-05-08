import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card/wallet-card.component";
import { WalletListHeaderComponent } from "./wallet-list-header/wallet-list-header.component";
import { WalletsActionsComponent } from "./wallets-actions/wallets-actions.component";
import { WalletsEmptyListComponent } from "./wallets-empty-list/wallets-empty-list.component";

storiesOf("Wallets", module)
	.addDecorator(
		moduleMetadata({
			declarations: [
				WalletsEmptyListComponent,
				WalletListHeaderComponent,
				WalletCardComponent,
				WalletsActionsComponent,
			],
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
	.add("Wallet list header - vertical", () => ({
		component: WalletListHeaderComponent,
		props: {
			importWalletClick: action("Import Button!"),
			generateWalletClick: action("Generate Button!"),
		},
		template: `
			<ion-app>
				<ion-content>
					<wallet-list-header
						name="Caio"
						direction="vertical"
						currencySymbol="$"
						totalBalance="200000000"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallet-list-header>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Wallet list header - horizontal", () => ({
		component: WalletListHeaderComponent,
		props: {
			importWalletClick: action("Import Button!"),
			generateWalletClick: action("Generate Button!"),
		},
		template: `
			<ion-app>
				<ion-content>
					<wallet-list-header
						name="Caio"
						direction="horizontal"
						currencySymbol="BRL"
						totalBalance="200000000"
						(importWalletClick)="importWalletClick()"
						(generateWalletClick)="generateWalletClick()">
					</wallet-list-header>
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
			currency: "ARK",
		},
		template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-card [name]="name" [balance]="balance" [currency]="currency" [address]="address"></wallet-card>
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
			currency: "BTC",
		},
		template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<wallet-card [name]="name" [balance]="balance" [currency]="currency" [address]="address"></wallet-card>
				</ion-content>
			</ion-app>
		`,
	}));
