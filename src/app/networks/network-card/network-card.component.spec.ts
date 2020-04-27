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
			<network-card type="mainet" name="ARK Ecosystem"></network-card>
		`);
		const networkType = spectator.query(byTestId("c-network-card--type"));
		const networkName = spectator.query(byTestId("c-network-card--name"));

		expect(networkType).toHaveText("mainet");
		expect(networkName).toHaveText("ARK Ecosystem");
	});
});
