import { createHostComponentFactory, SpectatorHost } from "@ngneat/spectator";

import { IdenticonComponent } from "./identicon.component";

describe("Identicon", () => {
	let spectator: SpectatorHost<IdenticonComponent>;
	const createHost = createHostComponentFactory({
		component: IdenticonComponent,
	});

	it("should create", () => {
		spectator = createHost(`<identicon value="abc"></identicon>`);
		expect(spectator.component).toBeTruthy();
	});
});
