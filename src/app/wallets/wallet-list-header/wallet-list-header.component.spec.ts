import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListHeaderComponentModule } from "../wallet-list-header/wallet-list-header.component.module";
import { WalletListHeaderComponent } from "./wallet-list-header.component";

describe("Wallet list header", () => {
	let spectator: SpectatorHost<WalletListHeaderComponent>;
	const createHost = createHostFactory({
		component: WalletListHeaderComponent,
		imports: [
			WalletListActionsComponentModule,
			WalletListHeaderComponentModule,
		],
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

		const component = spectator.query(byTestId("wallet-list-header"));
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

		const username = spectator.query(
			byTestId("wallet-list-header__username"),
		);
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

		const balance = spectator.query(
			byTestId("wallet-list-header__balance"),
		);
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
			byTestId("wallet-list-actions-button__import"),
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
			byTestId("wallet-list-actions-button__generate"),
		);

		spectator.click(generateButton);

		expect(output).toBe("generate");
	});
});
