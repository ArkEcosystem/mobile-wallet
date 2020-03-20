import { CommonModule } from "@angular/common";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { render } from "@testing-library/angular";
import { BigNumber } from "bignumber.js";

import { PipesModule } from "@/pipes/pipes.module";

import { InputCurrencyComponentModule } from "../input-currency/input-currency.module";
import { InputFeeComponent } from "./input-fee.component";

function createComponent(props?: Partial<InputFeeComponent>) {
	return render(InputFeeComponent, {
		imports: [
			IonicModule,
			TranslateModule.forRoot(),
			InputCurrencyComponentModule,
			PipesModule,
			CommonModule,
			ReactiveFormsModule,
		],
		componentProperties: {
			...props,
		},
		providers: [FormGroupDirective],
	});
}

describe("Input Fee Component", () => {
	it("should create", async () => {
		const component = await createComponent();
		expect(component.fixture.componentInstance.isStatic).toBeTrue();
	});

	describe("Initial value", () => {
		it("should set last fee by default if specified", async () => {
			const component = await createComponent({
				last: 15.2,
				min: 5,
				avg: 20,
				max: 30,
			});
			const inputControl =
				component.fixture.componentInstance.inputControl;
			expect(BigNumber.isBigNumber(inputControl.value)).toBeTrue();
			expect(inputControl.value.isEqualTo("0.000000152")).toBeTrue();
		});

		it("should set avg fee by default if the last was not specified", async () => {
			const component = await createComponent({
				min: 5,
				avg: 20,
				max: 30,
			});
			const inputControl =
				component.fixture.componentInstance.inputControl;
			expect(BigNumber.isBigNumber(inputControl.value)).toBeTrue();
			expect(inputControl.value.isEqualTo("0.0000002")).toBeTrue();
		});

		it("should set max fee by default if the last and avg was not specified", async () => {
			const component = await createComponent({
				min: 5,
				max: 30,
			});
			const inputControl =
				component.fixture.componentInstance.inputControl;
			expect(BigNumber.isBigNumber(inputControl.value)).toBeTrue();
			expect(inputControl.value.isEqualTo("0.0000003")).toBeTrue();
		});
	});

	xdescribe("Controls", () => {
		it("should hide the controls if max is equals to min", async () => {
			const component = await createComponent({
				min: 1,
				max: 1,
			});
			expect(() =>
				component.getByTestId("c-input-fee__controls"),
			).toThrowError();
		});

		it("should change value by clicking on the min button", async () => {
			const component = await createComponent({
				min: 11.1,
				max: 20,
			});
			component.click(
				component.getByTestId("c-input-fee__controls__min"),
			);
			expect(
				component.fixture.componentInstance.inputControl.value.isEqualTo(
					"0.000000111",
				),
			);
		});

		it("should change value by clicking on the avg button", async () => {
			const component = await createComponent({
				avg: 11.1,
				max: 20,
			});
			component.click(
				component.getByTestId("c-input-fee__controls__avg"),
			);
			expect(
				component.fixture.componentInstance.inputControl.value.isEqualTo(
					"0.000000111",
				),
			);
		});

		it("should change value by clicking on the max button", async () => {
			const component = await createComponent({
				max: 11.1,
			});
			component.click(
				component.getByTestId("c-input-fee__controls__max"),
			);
			expect(
				component.fixture.componentInstance.inputControl.value.isEqualTo(
					"0.000000111",
				),
			);
		});
	});

	describe("Range", () => {
		it("should show the range if max is greater than min", async () => {
			const component = await createComponent({
				min: 10,
				max: 20,
			});
			expect(component.fixture.componentInstance.hasRange).toBeTrue();
		});

		it("should change value by updating the range", async () => {
			const component = await createComponent({
				min: 10,
				max: 20,
			});
			const {
				rangeControl,
				inputControl,
				min,
			} = component.fixture.componentInstance;
			rangeControl.setValue(min);
			expect(inputControl.value.isEqualTo("0.0000001")).toBeTrue();
		});
	});

	describe("Minimum limit", () => {
		it("should set limitMin to min if it is different from avg", async () => {
			const component = await createComponent({
				min: 100,
				avg: 200,
			});
			expect(component.fixture.componentInstance.limitMin).toBe(100);
		});

		it("should set limitMin to min if it is different from max", async () => {
			const component = await createComponent({
				min: 100,
				max: 200,
			});
			expect(component.fixture.componentInstance.limitMin).toBe(100);
		});

		it("should set limitMin to 1 arktoshi if min is equal to avg", async () => {
			const component = await createComponent({
				min: 100,
				avg: 100,
			});
			expect(component.fixture.componentInstance.limitMin).toBe(1);
		});

		it("should set limitMin to 1 arktoshi if min is equal to max", async () => {
			const component = await createComponent({
				min: 100,
				max: 100,
			});
			expect(component.fixture.componentInstance.limitMin).toBe(1);
		});
	});
});
