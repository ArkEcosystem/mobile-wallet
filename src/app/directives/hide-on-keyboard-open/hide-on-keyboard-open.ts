import { Directive, ElementRef, Renderer2 } from "@angular/core";
import { Platform } from "@ionic/angular";

@Directive({
	selector: "[appHideOnKeyboardOpen]",
})
export class HideOnKeyboardOpenDirective {
	constructor(
		private renderer: Renderer2,
		private platform: Platform,
		el: ElementRef,
	) {
		if (!this.platform.is("ios")) {
			this.renderer.addClass(el.nativeElement, "hide-on-keyboard-open");
		}
	}
}
