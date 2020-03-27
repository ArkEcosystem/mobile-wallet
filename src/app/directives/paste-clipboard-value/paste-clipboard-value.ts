import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Platform } from "@ionic/angular";

@Directive({
	selector: "[appPasteClipboardValue]",
})
export class PasteClipboardValueDirective {
	constructor(private model: NgControl, private platform: Platform) {}

	@HostListener("paste", ["$event"])
	onPaste(input: ClipboardEvent) {
		const value = input?.clipboardData?.getData("text");

		if (this.platform.is("desktop")) {
			return;
		}

		if (value) {
			this.model.control.patchValue("");
		}
	}
}
