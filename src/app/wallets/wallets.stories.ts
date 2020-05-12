import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card/wallet-card.component";
import { WalletListActionsComponent } from "./wallet-list-actions/wallet-list-actions.component";
import { WalletListEmptyComponent } from "./wallet-list-empty/wallet-list-empty.component";
import { WalletListHeaderComponent } from "./wallet-list-header/wallet-list-header.component";

storiesOf("wallets", module)
	.addDecorator(
		moduleMetadata({
			declarations: [
				WalletListEmptyComponent,
				WalletListHeaderComponent,
				WalletCardComponent,
				WalletListActionsComponent,
			],
			imports: [TranslateModule, IonicModule, PipesModule],
		}),
	)
	.add("wallet-list-empty", () => ({
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
	}))
	.add("wallet-list-header__vertical", () => ({
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
	.add("wallet-list-header__horizontal", () => ({
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
	.add("wallet-card__ark", () => ({
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
	.add("wallet-card__alt-coin", () => ({
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
