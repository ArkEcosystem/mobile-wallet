import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { WalletsActionsComponentModule } from "../wallets-actions/wallets-actions.component.module";
import { WalletListHeaderComponent } from "./wallet-list-header.component";

describe("Wallet list header", () => {
	let spectator: SpectatorHost<WalletListHeaderComponent>;
	const createHost = createHostComponentFactory({
		component: WalletListHeaderComponent,
		imports: [WalletsActionsComponentModule],
	});

	it("should create", () => {
		spectator = createHost(
			`<wallet-list-header
                [name]="name"
                [direction]="direction"
                [currencySymbol]="currencySymbol"
                [totalBalance]="totalBalance"
            ></wallet-list-header>`,
			{
				hostProps: {
					address: "",
				},
			},
		);
		let output: any;
		spectator
			.output("importWalletClick")
			.subscribe(() => "importWalletClick");
		spectator
			.output("generateWalletClick")
			.subscribe(() => "generateWalletClick");

		const component = spectator.query(byTestId("c-wallet__list--header"));
		expect(component).toBeTruthy();
	});

	it("should have a username rendered", () => {
		spectator = createHost(
			`<wallet-list-header
                [name]="name"
            ></wallet-list-header>`,
			{
				hostProps: {
					name: "Caio",
				},
			},
		);

		const username = spectator.query(byTestId("c-wallet__list--username"));
		expect(username).toHaveText("Caio, this is your balance");
	});

	it("should have a balance rendered", () => {
		spectator = createHost(
			`<wallet-list-header
                [totalBalance]="totalBalance"
                [currencySymbol]="currencySymbol"
            ></wallet-list-header>`,
			{
				hostProps: {
					totalBalance: "200000",
					currencySymbol: "$",
				},
			},
		);

		const balance = spectator.query(byTestId("c-wallet__list--balance"));
		expect(balance).toHaveText("200000 $");
	});
});
