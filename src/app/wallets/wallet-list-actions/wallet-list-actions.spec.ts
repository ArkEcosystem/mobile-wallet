import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { WalletListActionsComponent } from "./wallet-list-actions.component";

describe("Wallet List Actions", () => {
	let spectator: SpectatorHost<WalletListActionsComponent>;
	const createHost = createHostFactory({
		component: WalletListActionsComponent,
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallet-list-actions></wallet-list-actions></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should have a functional import button", () => {
		spectator = createHost(
			`<ion-content><wallet-list-actions></wallet-list-actions></ion-content>`,
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
			`<ion-content><wallet-list-actions></wallet-list-actions></ion-content>`,
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
