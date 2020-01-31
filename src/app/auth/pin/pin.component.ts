import { Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "auth-pin",
	templateUrl: "pin.component.html",
})
export class AuthPinComponent {
	@Output()
	public authorized = new EventEmitter();

	@Output()
	public denied = new EventEmitter();

	constructor() {}

	public authorize() {
		this.authorized.next();
	}

	public deny() {
		this.denied.next();
	}
}
