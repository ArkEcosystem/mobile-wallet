import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs, sleep } from "@@/test/helpers";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { DelegateListComponent } from "./delegate-list.component";

describe("Delegate List", () => {
	let spectator: SpectatorHost<DelegateListComponent>;
	const createHost = createHostFactory({
		component: DelegateListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule,
			IdenticonComponentModule,
		],
	});
	const delegates = [
		{ username: "test_1", rank: 1 },
		{ username: "test_2", rank: 2 },
	];

	beforeAll(() => removeLogs());

	it("should create", () => {
		spectator = createHost(
			`<ion-content><delegate-list></delegate-list></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should render the list", async () => {
		spectator = createHost(
			`<ion-content>
				<delegate-list [delegates]="delegates"></delegate-list>
			</ion-content>`,
			{
				hostProps: {
					delegates,
				},
			},
		);
		await sleep(100);
		const items = spectator.queryAll(
			byTestId("delegate-list__virtual-item"),
		);
		const username = spectator.query(
			byTestId("delegate-list__item__username"),
		);
		const identicon = spectator.query(
			byTestId("delegate-list__item__identicon"),
		);
		expect(items).toHaveLength(delegates.length);
		expect(identicon).toBeVisible();
		expect(username).toHaveText(delegates[0].username);
	});

	it("should hide the identicon", async () => {
		spectator = createHost(
			`<ion-content>
				<delegate-list [delegates]="delegates" [showIdenticon]="false"></delegate-list>
			</ion-content>`,
			{
				hostProps: {
					delegates,
				},
			},
		);
		await sleep(100);
		const identicon = spectator.query(
			byTestId("delegate-list__item__identicon"),
		);
		expect(identicon).not.toBeVisible();
	});

	it("should emit event on click", async () => {
		spectator = createHost(
			`<ion-content>
				<delegate-list [delegates]="delegates"></delegate-list>
			</ion-content>`,
			{
				hostProps: {
					delegates,
				},
			},
		);
		await sleep(100);

		let output: any;
		spectator
			.output("delegateListClick")
			.subscribe((result) => (output = result));

		const firstButton = spectator.query(
			byTestId("delegate-list__virtual-item__button"),
		);
		spectator.click(firstButton);
		expect(output).toEqual(delegates[0]);
	});
});
