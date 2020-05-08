import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { WalletsEmptyListComponent } from "./wallets-empty-list.component";

describe("Wallets empty List", () => {
	let spectator: SpectatorHost<WalletsEmptyListComponent>;
	const createHost = createHostFactory({
		component: WalletsEmptyListComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
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
});
