import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { sleep } from "@@/test/helpers";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListComponent } from "./recipient-list.component";

fdescribe("Recipient List", () => {
	let spectator: SpectatorHost<RecipientListComponent>;
	const createHost = createHostFactory({
		component: RecipientListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			IdenticonComponentModule,
			PipesModule,
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><recipient-list [recipients]="recipients"></recipient-list></ion-content>`,
		);

		const component = spectator.query(byTestId("recipient-list"));

		expect(component).toBeTruthy();
	});

	it("should render recipients", () => {
		spectator = createHost(
			`<ion-content><recipient-list [recipients]="recipients"></recipient-list></ion-content>`,
			{
				hostProps: {
					recipients: [
						{
							address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
							amount: "212391242139",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
					],
				},
			},
		);

		const recipients = spectator.queryAll(".recipient-list__recipient");
		expect(recipients.length).toEqual(2);
	});

	it("should remove a recipient from list", async () => {
		spectator = createHost(
			`<ion-content><recipient-list [recipients]="recipients"></recipient-list></ion-content>`,
			{
				hostProps: {
					recipients: [
						{
							address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
							amount: "212391242139",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
					],
				},
			},
		);

		const removeButton = spectator.query(
			byTestId("recipient-list__action--delete"),
		);
		spectator.click(removeButton);
		await sleep(300);
		const recipients = spectator.queryAll(".recipient-list__recipient");

		expect(recipients.length).toEqual(1);
	});

	it("should edit a recipient from list", async () => {
		spectator = createHost(
			`<ion-content><recipient-list [recipients]="recipients"></recipient-list></ion-content>`,
			{
				hostProps: {
					recipients: [
						{
							address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
							amount: "212391242139",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
					],
				},
			},
		);

		const editButton = spectator.query(
			byTestId("recipient-list__action--edit"),
		);
		spectator.click(editButton);
		await sleep(300);

		const editingList = spectator.component.editing;

		expect(editingList).toContain("AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9");
	});
});
