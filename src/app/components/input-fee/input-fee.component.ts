import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";

import { ARKTOSHI_DP } from "@/app/app.constants";
import BigNumber, { SafeBigNumber } from "@/utils/bignumber";

import { InputCurrencyOutput } from "../input-currency/input-currency.component";

@Component({
	selector: "input-fee",
	templateUrl: "input-fee.component.html",
	styleUrls: ["input-fee.component.pcss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputFeeComponent implements OnInit, OnChanges {
	@Output()
	public inputFeeUpdate = new EventEmitter<InputCurrencyOutput>();

	// Arktoshi
	@Input()
	public min = 1;

	// Arktoshi
	@Input()
	public avg: number;

	// Arktoshi
	@Input()
	public max = 1;

	// Arktoshi
	@Input()
	public last: number;

	@Input()
	public isStatic = true;

	public hasRange = true;
	public rangeControl = new FormControl(0);
	public currentFee: number;

	constructor(private parentForm: FormGroupDirective) {}

	ngOnChanges() {
		this.hasRange = this.min !== this.max;
	}

	ngOnInit() {
		this.parentForm.form.addControl("fee", new FormControl());
		this.parentForm.form.controls.fee.valueChanges.subscribe(
			(value: BigNumber) => {
				// The range value should be in arktoshi
				this.currentFee = value.shiftedBy(ARKTOSHI_DP).toNumber();
				this.rangeControl.setValue(this.currentFee, {
					emitEvent: false,
				});
			},
		);

		this.rangeControl.valueChanges.subscribe((value: number) => {
			this.currentFee = value;
			this.setInputValue(value, false);
		});

		// Initial value
		this.setInputValue(this.last || this.avg);
	}

	onMax() {
		this.setInputValue(this.max);
	}

	onAvg() {
		this.setInputValue(this.avg);
	}

	onMin() {
		this.setInputValue(this.min);
	}

	emitUpdate(output: InputCurrencyOutput) {
		this.inputFeeUpdate.emit(output);
	}

	private setInputValue(value: number, emitEvent = true) {
		// The input value should be in human
		const satoshi = new SafeBigNumber(value).shiftedBy(ARKTOSHI_DP * -1);
		this.parentForm.form.controls.fee.setValue(satoshi, {
			emitEvent,
		});
	}
}
