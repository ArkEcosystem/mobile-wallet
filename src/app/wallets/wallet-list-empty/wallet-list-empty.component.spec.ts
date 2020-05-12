import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletsEmptyListComponent } from "./wallet-list-empty.component";

describe("Wallets empty List", () => {
	let spectator: SpectatorHost<WalletsEmptyListComponent>;
	const createHost = createHostFactory({
		component: WalletsEmptyListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			WalletListActionsComponentModule,
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallet-list-empty ></wallet-list-empty></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should set greeting properly", () => {
		spectator = createHost(
			`<ion-content><wallet-list-empty name="Caio"></wallet-list-empty></ion-content>`,
		);
		const greeting = spectator.query(
			byTestId("wallet-list-empty__username"),
		).innerHTML;

		expect(greeting).toEqual(" Hi, Caio! ");
	});

	it("should have a functional import button", () => {
		spectator = createHost(
			`<ion-content><wallet-list-empty name="Caio"></wallet-list-empty></ion-content>`,
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
			`<ion-content><wallet-list-empty name="Caio"></wallet-list-empty></ion-content>`,
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
