import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { WalletsActionsComponentModule } from "../wallets-actions/wallets-actions.component.module";
import { WalletsEmptyListComponent } from "./wallets-empty-list.component";

describe("Wallets empty List", () => {
	let spectator: SpectatorHost<WalletsEmptyListComponent>;
	const createHost = createHostFactory({
		component: WalletsEmptyListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			WalletsActionsComponentModule,
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallets-empty-list ></wallets-empty-list></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should set greeting properly", () => {
		spectator = createHost(
			`<ion-content><wallets-empty-list name="Caio"></wallets-empty-list></ion-content>`,
		);
		const greeting = spectator.query(
			byTestId("wallets-empty-list--username"),
		).innerHTML;

		expect(greeting).toEqual(" Hi, Caio! ");
	});

	it("should have a functional import button", () => {
		spectator = createHost(
			`<ion-content><wallets-empty-list name="Caio"></wallets-empty-list></ion-content>`,
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
			`<ion-content><wallets-empty-list name="Caio"></wallets-empty-list></ion-content>`,
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
