import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs, sleep } from "@@/test/helpers";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

import { ImportInputComponent } from "./import-input.component";

describe("Import input component", () => {
	let spectator: SpectatorHost<ImportInputComponent>;
	const createHost = createHostFactory({
		component: ImportInputComponent,
		imports: [
			IonicModule.forRoot(),
			DirectivesModule,
			FormsModule,
			ReactiveFormsModule,
			TranslateModule.forRoot(),
		],
		providers: [TruncateMiddlePipe],
	});

	beforeAll(() => removeLogs());

	it("should work with ngModel", async () => {
		spectator = createHost(
			`<import-input [(ngModel)]="address"></import-input>`,
			{
				hostProps: {
					address: "",
				},
			},
		);
		await sleep(200);
		const root = spectator.query(byTestId("c-import-wallet__input"));
		const input = root.querySelector("input");
		spectator.typeInElement("A01238Ts3dQ2bvBR1tPE7GUee9iSEJb8HX", input);
		input.blur();
		await sleep(100);
		// @ts-ignore
		expect(spectator.hostComponent.address).toEqual(
			"A01238Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
		);
	});

	it("should work with formControl", async () => {
		spectator = createHost(
			`<div><import-input [formControl]="address"></import-input></div>`,
			{
				hostProps: {
					address: new FormControl(""),
				},
			},
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-import-wallet__input"));
		const input = root.querySelector("input");
		spectator.typeInElement("A32108Ts3dQ2bvBR1tPE7GUee9iSEJb8HX", input);
		input.blur();
		await sleep(100);
		// @ts-ignore
		expect(spectator.hostComponent.address.value).toEqual(
			"A32108Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
		);
	});

	it("should truncate on blur", async () => {
		spectator = createHost(
			`<import-input [(ngModel)]="address"></import-input>`,
			{
				hostProps: {
					address: "",
				},
			},
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-import-wallet__input"));
		const input = root.querySelector("input");
		spectator.typeInElement("AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX", input);
		input.blur();
		await sleep(100);
		// @ts-ignore
		expect(input).toHaveValue("AXzxJ8T...SEJb8HX");
	});
});
