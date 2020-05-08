import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { WalletsActionsComponent } from "./wallets-actions.component";

describe("Wallets Actions", () => {
	let spectator: SpectatorHost<WalletsActionsComponent>;
	const createHost = createHostFactory({
		component: WalletsActionsComponent,
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallets-actions></wallets-actions></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should have a functional import button", () => {
		spectator = createHost(
			`<ion-content><wallets-actions></wallets-actions></ion-content>`,
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
			`<ion-content><wallets-actions></wallets-actions></ion-content>`,
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
