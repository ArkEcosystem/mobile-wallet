import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { NetworkListComponent } from "./network-list.component";

describe("Network List", () => {
	let spectator: SpectatorHost<NetworkListComponent>;
	const createHost = createHostComponentFactory({
		component: NetworkListComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
	});

	it("should render with an empty network list", () => {
		spectator = createHost(`<network-list></network-list>`);
		const itemsList = spectator.query(byTestId("c-network-list__items"));

		expect(itemsList).toEqual(null);
	});

	it("should render with a filled network list", () => {
		const networks = [
			{
				name: "ARK Ecosystem",
				type: "mainnet",
			},
		];
		spectator = createHost(
			`<network-list [networks]="networks"></network-list>`,
			{
				hostProps: {
					networks,
				},
			},
		);

		const itemsList = spectator.query(byTestId("c-network-list__items"));

		expect(itemsList).not.toEqual(null);
	});
});
