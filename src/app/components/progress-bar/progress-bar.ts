import { Component, Input } from "@angular/core";

@Component({
	selector: "progress-bar",
	templateUrl: "progress-bar.html",
	styleUrls: ["progress-bar.pcss"],
})
export class ProgressBarComponent {
	@Input()
	public progress: string;

	constructor() {}
}
