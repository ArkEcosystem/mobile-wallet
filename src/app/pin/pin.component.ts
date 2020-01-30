import { Component } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { PinState } from "./shared/pin.state";

@Component({
	selector: "pin-handler",
	templateUrl: "pin.component.html",
})
export class PinComponent {
	@Select(PinState.isOpen)
	public isOpen$: Observable<boolean>;

	constructor() {}

	public authorize() {
		PinState.subject.next();
	}
}
