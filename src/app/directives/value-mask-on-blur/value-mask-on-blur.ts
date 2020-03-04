import { Directive, HostListener, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[appValueMaskOnBlur]",
})
export class ValueMaskOnBlurDirective {
	@Input()
	public appValueMaskOnBlur: string;

	public isFocused = false;

	constructor(private model: NgControl) {}

	// Handle programmatically changes
	@HostListener("ionChange")
	onChange() {
		if (!this.isFocused) {
			this.maskValue();
		}
	}

	@HostListener("ionFocus")
	onFocus() {
		this.isFocused = true;
		this.model.valueAccessor.writeValue(this.model.value);
	}

	@HostListener("ionBlur")
	onBlur() {
		this.isFocused = false;
		this.maskValue();
	}

	private maskValue() {
		this.model.valueAccessor.writeValue(this.appValueMaskOnBlur);
	}
}
