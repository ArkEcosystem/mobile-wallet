import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListHeaderComponentModule } from "../wallet-list-header/wallet-list-header.component.module";
import { WalletListComponent } from "./wallet-list.component";

describe("Wallet List Component", () => {
	let spectator: SpectatorHost<WalletListComponent>;

	const createHost = createHostFactory({
		component: WalletListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			WalletListHeaderComponentModule,
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallet-list></wallet-list></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should render the list header", () => {
		spectator = createHost(
			`<ion-content><wallet-list></wallet-list></ion-content>`,
		);

		expect(spectator.query(byTestId("wallet-list-header"))).toBeTruthy();
	});
});
