import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[appPasteClipboardValue]",
})
export class PasteClipboardValueDirective {
	constructor(private model: NgControl) {}

	@HostListener("paste", ["$event"])
	onPaste(input: ClipboardEvent) {
		const value = input?.clipboardData?.getData("text");
		if (value) {
			this.model.control.setValue(value);
		}
	}
}
