import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { BigNumber } from "bignumber.js";

import { removeLogs, sleep } from "@@/test/helpers";

import { InputCurrencyComponent } from "./input-currency.component";

describe("Input Currency", () => {
	let spectator: SpectatorHost<InputCurrencyComponent>;
	const createHost = createHostFactory({
		component: InputCurrencyComponent,
		imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule],
	});

	beforeAll(async () => removeLogs());

	it("should assign the placeholder if not specified", async () => {
		spectator = createHost(`<input-currency></input-currency>`);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		expect(input.getAttribute("placeholder")).toBe("0.00000000");
	});

	it("should assign the placeholder", async () => {
		spectator = createHost(
			`<input-currency placeholder="2"></input-currency>`,
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		expect(input.getAttribute("placeholder")).toBe("2");
	});

	it("should not allow letters and symbols", async () => {
		spectator = createHost(`<input-currency></input-currency>`);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		spectator.typeInElement("ab1c", input);
		await sleep(100);
		expect(input).toHaveValue("1");
		spectator.typeInElement("@!0$%", input);
		await sleep(100);
		expect(input).toHaveValue("0");
	});

	it("should convert comma into dot separator", async () => {
		spectator = createHost(`<input-currency></input-currency>`);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		spectator.typeInElement("0,01", input);
		await sleep(100);
		expect(input).toHaveValue("0.01");
	});

	it("should allow to start with a separator", async () => {
		spectator = createHost(`<input-currency></input-currency>`);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		spectator.typeInElement(".01", input);
		await sleep(100);
		expect(input).toHaveValue("0.01");
	});

	it("should not allow typing more decimal places than the fraction digits", async () => {
		spectator = createHost(
			`<input-currency [fractionDigits]="2"></input-currency>`,
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		spectator.typeInElement("0.12345", input);
		await sleep(100);
		expect(input).toHaveValue("0.12");
	});

	it("should work with ngModel", async () => {
		spectator = createHost(
			`<input-currency [(ngModel)]="value"></input-currency>`,
			{
				hostProps: {
					value: 0,
				},
			},
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		spectator.typeInElement("a0.12345", input);
		await sleep(100);
		// @ts-ignore
		expect(BigNumber.isBigNumber(spectator.hostComponent.value)).toBeTrue();
		// @ts-ignore
		expect(spectator.hostComponent.value.isEqualTo(0.12345)).toBeTrue();
	});

	it("should work with BigNumber", async () => {
		spectator = createHost(
			`<input-currency [(ngModel)]="value"></input-currency>`,
			{
				hostProps: {
					value: new BigNumber(0.12),
				},
			},
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		// @ts-ignore
		expect(input).toHaveValue("0.12");
	});

	it("should be disabled", async () => {
		spectator = createHost(
			`<input-currency [isDisabled]="true"></input-currency>`,
		);
		await sleep(100);
		const root = spectator.query(byTestId("c-input-currency"));
		const input = root.querySelector("input");
		expect(input).toBeDisabled();
	});
});
