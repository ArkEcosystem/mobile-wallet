import { Component, Input } from "@angular/core";

@Component({
	selector: "auth-locked",
	templateUrl: "auth-locked.component.html",
})
export class AuthLockedComponent {
	@Input()
	public remainingSeconds: number;

	constructor() {}
}
