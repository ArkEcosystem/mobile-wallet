import { ARKTOSHI_DP } from "@/app/app.constants";
import { SafeBigNumber } from "@/utils/bignumber";
import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";

export interface IInputCurrencyOutput {
	display: string;
	value: BigNumber;
	satoshi: BigNumber;
}

@Component({
	selector: "input-currency",
	templateUrl: "input-currency.component.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputCurrencyComponent),
			multi: true,
		},
	],
})
export class InputCurrencyComponent implements OnInit, ControlValueAccessor {
	public formControl = new FormControl("");

	@Output()
	public updated = new EventEmitter<IInputCurrencyOutput>();

	@Input()
	public name: string;

	@Input()
	public placeholder: string;

	@Input()
	public fractionDigits = ARKTOSHI_DP;

	public isDisabled: boolean;
	public input: (value: BigNumber) => void;
	public onTouched = () => {};

	constructor() {}

	writeValue(value: string | number | BigNumber): void {
		if (SafeBigNumber.isBigNumber(value)) {
			this.format(value.toString());
		} else {
			this.format(String(value));
		}
	}

	registerOnChange(fn: (value: BigNumber) => void): void {
		this.input = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	ngOnInit() {
		this.formControl.valueChanges.subscribe((value: string) => {
			const formatted = this.format(value);
			this.input(formatted.value);
		});

		if (!this.placeholder) {
			this.placeholder = (0).toFixed(this.fractionDigits);
		}
	}

	private format(value: string) {
		const sanitized = this.sanitizeInput(value);
		this.formControl.setValue(sanitized.display, { emitEvent: false });
		this.updated.emit(sanitized);
		return sanitized;
	}

	/**
	 * Copied from https://github.com/LedgerHQ/ledger-live-desktop with changes
	 */
	private sanitizeInput(input: string): IInputCurrencyOutput {
		const numbers = "0123456789";
		const separatos = ".,";

		let display = "";
		let decimals = -1;

		for (let i = 0; i < input.length; i++) {
			const char = input[i];
			if (numbers.indexOf(char) !== -1) {
				if (decimals >= 0) {
					decimals++;
					if (decimals > this.fractionDigits) {
						break;
					}
				}
				display += char;
			} else if (decimals === -1 && separatos.indexOf(char) !== -1) {
				if (i === 0) {
					display = "0";
				}
				decimals = 0;
				display += ".";
			}
		}

		const zero = new SafeBigNumber(0);
		const value = display ? new SafeBigNumber(display) : zero;

		const satoshi = display ? value.shiftedBy(this.fractionDigits) : zero;

		return { display, value, satoshi };
	}
}
