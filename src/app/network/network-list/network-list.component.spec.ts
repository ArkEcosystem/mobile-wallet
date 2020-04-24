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

	it("should create", () => {
		spectator = createHost(`<network-list></network-list>`);
		const component = spectator.query(byTestId("c-network-list"));
		expect(component).toBeTruthy();
	});

	it("should render the title properly", () => {
		spectator = createHost(`<network-list></network-list>`);
		const title = spectator.query(byTestId("c-network-list--title"))
			.innerHTML;

		expect(title).toEqual(" NETWORKS_PAGE.TITLE ");
	});

	it("should render the subtitle properly", () => {
		spectator = createHost(`<network-list></network-list>`);
		const subtitle = spectator.query(byTestId("c-network-list--subtitle"))
			.innerHTML;

		expect(subtitle).toEqual(" NETWORKS_PAGE.SUBTITLE ");
	});

	it("should render the add network button", () => {
		spectator = createHost(`<network-list></network-list>`);
		let output: any;
		spectator
			.output("addNetworkClick")
			.subscribe(() => (output = "add network"));

		const addButton = spectator.query(
			byTestId("c-network-list__button--add"),
		);

		spectator.click(addButton);

		expect(addButton).toBeTruthy();
		expect(output).toEqual("add network");
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
