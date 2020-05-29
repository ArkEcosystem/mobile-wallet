import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { RecipientListResumeComponent } from "./recipient-list-resume.component";

describe("Recipient List Resume", () => {
	let spectator: SpectatorHost<RecipientListResumeComponent>;
	const createHost = createHostFactory({
		component: RecipientListResumeComponent,
		imports: [IonicModule.forRoot(), IdenticonComponentModule],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><recipient-list-resume></recipient-list-resume></ion-content>`,
		);

		const component = spectator.query(byTestId("recipient-list-resume"));

		expect(component).toBeTruthy();
	});

	it("should have the same quantity of recipients in the counter", () => {
		spectator = createHost(
			`<ion-content><recipient-list-resume [recipients]="recipients"></recipient-list-resume></ion-content>`,
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

		const counter = spectator.query(
			byTestId("recipient-list-resume__counter"),
		);

		expect(counter).toHaveText("2");
	});

	it("should have the difference of recipients if more than 3 in the counter", () => {
		spectator = createHost(
			`<ion-content><recipient-list-resume [recipients]="recipients"></recipient-list-resume></ion-content>`,
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
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
						{
							address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
							amount: "192409974739",
						},
					],
				},
			},
		);

		const counter = spectator.query(
			byTestId("recipient-list-resume__counter"),
		);

		expect(counter).toHaveText("4");
	});

	it("should have 0 in counter if no recipients", () => {
		spectator = createHost(
			`<ion-content><recipient-list-resume></recipient-list-resume></ion-content>`,
		);

		const counter = spectator.query(
			byTestId("recipient-list-resume__counter"),
		);

		expect(counter).toHaveText("0");
	});
});
