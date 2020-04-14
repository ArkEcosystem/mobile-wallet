import { Component, Input } from "@angular/core";

enum iconTypes {
	success,
	warning,
	error,
}

@Component({
	selector: "alert-component",
	styleUrls: ["alert.component.scss"],
	templateUrl: "alert.component.html",
})
export class Alert {
	@Input()
	public type: iconTypes;

	public icons = {
		success: "checkmark",
		warning: "alert",
		error: "close",
	};

	@Input()
	public title: string;

	@Input()
	public message: string;

	constructor() {}
}
