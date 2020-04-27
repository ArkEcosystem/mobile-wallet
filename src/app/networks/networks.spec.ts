import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { NetworksComponent } from "./networks.component";

describe("Networks Component", () => {
	let spectator: SpectatorHost<NetworksComponent>;
	const createHost = createHostComponentFactory({
		component: NetworksComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
	});

	it("should create", () => {
		spectator = createHost(`<networks></networks>`);
		const component = spectator.query(byTestId("c-networks"));
		expect(component).toBeTruthy();
	});

	it("should render the title properly", () => {
		spectator = createHost(`<networks></networks>`);
		const title = spectator.query(byTestId("c-networks--title"));

		expect(title).toHaveText("NETWORKS_PAGE.NETWORK_OVERVIEW");
	});

	it("should render the subtitle properly", () => {
		spectator = createHost(`<networks></networks>`);
		const subtitle = spectator.query(byTestId("c-networks--subtitle"));

		expect(subtitle).toHaveText("NETWORKS_PAGE.SUBTITLE");
	});

	it("should render the add network button", () => {
		spectator = createHost(`<networks></networks>`);

		const addButton = spectator.query(byTestId("c-networks__button--add"));

		expect(addButton).toBeTruthy();
	});

	it("should render the search network button", () => {
		spectator = createHost(`<networks></networks>`);

		const searchButton = spectator.query(
			byTestId("c-networks__button--search"),
		);

		expect(searchButton).toBeTruthy();
	});

	it("should render the menu button", () => {
		spectator = createHost(`<networks></networks>`);
		const menuButton = spectator.query(
			byTestId("c-networks__button--menu"),
		);

		expect(menuButton).toBeTruthy();
	});

	it("should render with an empty network list", () => {
		spectator = createHost(`<networks></networks>`);
		const itemsList = spectator.query(byTestId("c-network-list__items"));

		expect(itemsList).toEqual(null);
	});
});
