import { Component, Input } from "@angular/core";

@Component({
	selector: "alert-component",
	styleUrls: ["alert.component.scss"],
	templateUrl: "alert.component.html",
})
export class Alert {
	@Input()
	public type: string;

	@Input()
	public title: string;

	@Input()
	public message: string;

	constructor() {}
}
