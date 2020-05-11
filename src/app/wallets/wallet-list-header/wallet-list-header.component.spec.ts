import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { WalletsActionsComponentModule } from "../wallets-actions/wallets-actions.component.module";
import { WalletListHeaderComponent } from "./wallet-list-header.component";

describe("Wallet list header", () => {
	let spectator: SpectatorHost<WalletListHeaderComponent>;
	const createHost = createHostFactory({
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
		);

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

	it("should have a functional import button", () => {
		spectator = createHost(
			`<wallet-list-header
                [name]="name"
                [direction]="direction"
                [currencySymbol]="currencySymbol"
                [totalBalance]="totalBalance"
            ></wallet-list-header>`,
		);

		let output: any;
		spectator
			.output("importWalletClick")
			.subscribe(() => (output = "import"));

		const importButton = spectator.query(
			byTestId("wallets-actions__button--import"),
		);
		spectator.click(importButton);

		expect(output).toEqual("import");
	});

	it("should have a functional generate button", () => {
		spectator = createHost(
			`<wallet-list-header
                [name]="name"
                [direction]="direction"
                [currencySymbol]="currencySymbol"
                [totalBalance]="totalBalance"
            ></wallet-list-header>`,
		);

		let output: any;
		spectator
			.output("generateWalletClick")
			.subscribe(() => (output = "generate"));

		const generateButton = spectator.query(
			byTestId("wallets-actions__button--generate"),
		);

		spectator.click(generateButton);

		expect(output).toBe("generate");
	});
});
