import { Component, Input } from "@angular/core";

@Component({
	selector: "password-page",
	templateUrl: "password.component.html",
	styleUrls: ["password-page.component.scss"],
})
export class PasswordComponent {
	@Input()
	public words: Array<string> = [];

	constructor() {}
}
