import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { WalletCardComponent } from "./wallet-card.component";

describe("Network Card", () => {
	let spectator: SpectatorHost<WalletCardComponent>;
	const createHost = createHostComponentFactory({
		component: WalletCardComponent,
	});

	it("should create", () => {
		spectator = createHost(`<wallet-card></wallet-card>`);
		const component = spectator.query(byTestId("c-wallet-card"));
		expect(component).toBeTruthy();
	});
});
