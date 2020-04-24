import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { NetworkCardComponent } from "./network-card.component";

describe("Network Card", () => {
	let spectator: SpectatorHost<NetworkCardComponent>;
	const createHost = createHostComponentFactory({
		component: NetworkCardComponent,
	});

	it("should create", () => {
		spectator = createHost(`<network-card></network-card>`);
		const component = spectator.query(byTestId("c-network-card"));
		expect(component).toBeTruthy();
	});

	it("should have a network name and type rendered", () => {
		spectator = createHost(`
			<network-card type="mainnet" name="Bitcoin"></network-card>
		`);
		const networkType = spectator.query(byTestId("network-card--type"))
			.innerHTML;
		const networkName = spectator.query(byTestId("network-card--name"))
			.innerHTML;

		expect(networkType).toEqual(" mainnet ");
		expect(networkName).toEqual(" Bitcoin ");
	});
});
