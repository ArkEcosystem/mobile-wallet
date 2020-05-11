import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	Output,
	Self,
	ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { IonInput } from "@ionic/angular";

import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

@Component({
	selector: "import-input",
	templateUrl: "import-input.component.html",
	styleUrls: ["import-input.component.scss"],
})
export class ImportInputComponent
	implements AfterViewInit, ControlValueAccessor {
	@ViewChild(IonInput)
	public ionInput: IonInput;

	@Output()
	public inputAddressQRCodeClick = new EventEmitter();

	@Input()
	public name = "address";

	@Input()
	public disabled = false;

	@Input()
	public showQRButton = true;

	public displayAddress: string;

	constructor(
		private truncateMiddlePipe: TruncateMiddlePipe,
		@Self() public ngControl: NgControl,
	) {
		this.ngControl.valueAccessor = this;
	}

	public onChange = (value: string) => {};
	public onTouched = () => {};

	writeValue(value: string): void {
		this.formatAddress(value);
	}

	async ngAfterViewInit() {
		try {
			const ionInput = await this.ionInput.getInputElement();
			ionInput.focus();
			ionInput.blur();
		} catch (e) {
			console.warn(e);
		}
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	public onInput(event: CustomEvent) {
		// @ts-ignore
		const value = event.target.value;
		this.formatAddress(value);

		if (!this.ngControl.name) {
			this.onChange(value);
		}
	}

	public emitQRCodeClick() {
		this.inputAddressQRCodeClick.emit();
	}

	private formatAddress(value: string) {
		this.displayAddress = this.truncateMiddlePipe.transform(value, 15);
	}
}
