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

	public hasRange = false;
	public rangeControl = new FormControl(0);
	public inputControl = new FormControl(0);
	public limitMin = 1;

	// Arktoshi
	public currentFee: number;

	constructor(private parentForm: FormGroupDirective) {}

	ngOnChanges() {
		this.checkRange();
	}

	ngOnInit() {
		this.parentForm.form.addControl("fee", this.inputControl);
		this.inputControl.valueChanges.subscribe((value: BigNumber) => {
			// The range value should be in arktoshi
			this.currentFee = value.shiftedBy(ARKTOSHI_DP).toNumber();
			this.rangeControl.setValue(this.currentFee, {
				emitEvent: false,
			});
		});

		this.rangeControl.valueChanges.subscribe((value: number) => {
			this.inputControl.markAsDirty();
			this.currentFee = value;
			this.setInputValue(value, false);
		});

		// Initial value
		this.setInputValue(this.last || this.avg || this.max);
		this.checkRange();
	}

	public handleClickButton(value: number) {
		this.setInputValue(value);
		this.inputControl.markAsDirty();
	}

	public emitUpdate(output: InputCurrencyOutput) {
		this.inputFeeUpdate.emit(output);
	}

	private checkRange() {
		// If the minimum input value is equal to the maximum or average
		// Set the minimum to 1 arktoshi
		if (this.min === this.max || this.min === this.avg) {
			this.limitMin = 1;
		} else {
			this.limitMin = this.min;
		}
		// Hide range if the minimum is equal to maximum
		this.hasRange = this.limitMin !== this.max;
	}

	private setInputValue(value: number, emitEvent = true) {
		// The input value should be in human
		const satoshi = new SafeBigNumber(value).shiftedBy(ARKTOSHI_DP * -1);
		this.inputControl.setValue(satoshi, {
			emitEvent,
		});
	}
}
