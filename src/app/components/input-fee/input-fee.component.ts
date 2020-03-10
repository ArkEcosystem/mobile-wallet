import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";

import BigNumber, { SafeBigNumber } from "@/utils/bignumber";

import { InputCurrencyOutput } from "../input-currency/input-currency.component";

@Component({
	selector: "input-fee",
	templateUrl: "input-fee.component.html",
	styleUrls: ["input-fee.component.scss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputFeeComponent implements OnInit {
	@Output()
	public inputFeeUpdate = new EventEmitter<InputCurrencyOutput>();

	@Input()
	public min: number;

	@Input()
	public avg: number;

	@Input()
	public max: number;

	@Input()
	public last: number;

	public rangeControl = new FormControl(0);
	public currentFee: number;

	constructor(private parentForm: FormGroupDirective) {}

	ngOnInit() {
		this.parentForm.form.addControl("fee", new FormControl());
		this.parentForm.form.controls.fee.valueChanges.subscribe(
			(value: BigNumber) => {
				this.currentFee = value.toNumber();
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
		this.parentForm.form.controls.fee.setValue(new SafeBigNumber(value), {
			emitEvent,
		});
	}
}
