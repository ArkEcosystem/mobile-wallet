import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, IonRange } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs, sleep } from "@@/test/helpers";
import { PipesModule } from "@/pipes/pipes.module";

import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";
import { InputFeeComponent } from "./input-fee.component";

describe("Input Fee", () => {
	let spectator: SpectatorHost<InputFeeComponent>;
	const createHost = createHostFactory({
		component: InputFeeComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			InputCurrencyComponentModule,
			PipesModule,
			ReactiveFormsModule,
		],
		providers: [FormGroupDirective],
	});

	beforeAll(() => removeLogs());

	describe("Initial value", () => {
		it("should set last fee by default if specified", async () => {
			spectator = createHost(
				`<input-fee [last]="15" [min]="5" [avg]="20" [max]="30"></input-fee>`,
			);
			await sleep(100);
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.00000015");
		});

		it("should set avg fee by default if the last was not specified", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [avg]="20" [max]="30"></input-fee>`,
			);
			await sleep(100);
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.0000002");
		});

		it("should set max fee by default if the last and avg was not specified", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [max]="30"></input-fee>`,
			);
			await sleep(100);
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.0000003");
		});
	});

	describe("Buttons", () => {
		it("should hide the buttons if max is equals to min", async () => {
			spectator = createHost(
				`<input-fee [min]="1" [max]="1"></input-fee>`,
			);
			await sleep(100);
			expect(
				spectator.query(byTestId("c-input-fee__controls")),
			).not.toBeVisible();
		});

		it("should change value by clicking on the min button", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [max]="30"></input-fee>`,
			);
			await sleep(100);
			spectator.click(
				spectator.query(byTestId("c-input-fee__controls__min")),
			);
			await spectator.fixture.whenStable();
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.00000005");
		});

		it("should change value by clicking on the avg button", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [avg]="20" [max]="30"></input-fee>`,
			);
			await sleep(100);
			spectator.click(
				spectator.query(byTestId("c-input-fee__controls__avg")),
			);
			await spectator.fixture.whenStable();
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.0000002");
		});

		it("should change value by clicking on the max button", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [avg]="20" [max]="30"></input-fee>`,
			);
			await sleep(100);
			spectator.click(
				spectator.query(byTestId("c-input-fee__controls__max")),
			);
			await spectator.fixture.whenStable();
			const root = spectator.query(byTestId("c-input-fee__currency"));
			const input = root.querySelector("input");
			expect(input).toHaveValue("0.0000003");
		});
	});

	describe("Range", () => {
		it("should show the range if max is greater than min", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [avg]="20" [max]="30"></input-fee>`,
			);
			await sleep(100);
			expect(
				spectator.query(byTestId("c-input-fee__range")),
			).toBeVisible();
		});

		it("should change the value by updating the range", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [max]="30"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(byTestId("c-input-fee__range"));
			range.setAttribute("value", "12");
			await sleep(100);
			const ionInput = spectator.query(byTestId("c-input-fee__currency"));
			const input = ionInput.querySelector("input");
			expect(input).toHaveValue("0.00000012");
		});

		it("should update the range by updating the value", async () => {
			spectator = createHost(
				`<input-fee [min]="5" [max]="30"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(byTestId("c-input-fee__range"));
			const ionInput = spectator.query(byTestId("c-input-fee__currency"));
			const input = ionInput.querySelector("input");
			spectator.typeInElement("0.0000001", input);
			await sleep(100);
			// @ts-ignore
			expect(range.value).toEqual(10);
		});
	});

	describe("Minimum limit", () => {
		it("should set limitMin to min if it is different from avg", async () => {
			spectator = createHost(
				`<input-fee [min]="100" [avg]="200" [max]="300"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(IonRange);
			expect(range.min).toBe(100);
		});

		it("should set limitMin to min if it is different from max", async () => {
			spectator = createHost(
				`<input-fee [min]="100" [max]="300"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(IonRange);
			expect(range.min).toBe(100);
		});

		it("should set limitMin to 1 arktoshi if min is equal to avg", async () => {
			spectator = createHost(
				`<input-fee [min]="200" [avg]="200" [max]="300"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(IonRange);
			expect(range.min).toBe(1);
		});

		it("should set limitMin to 1 arktoshi if min is equal to max", async () => {
			spectator = createHost(
				`<input-fee [min]="200" [max]="200"></input-fee>`,
			);
			await sleep(100);
			const range = spectator.query(IonRange);
			expect(range.min).toBe(1);
		});
	});
});
