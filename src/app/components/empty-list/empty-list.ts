import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "empty-list",
	templateUrl: "empty-list.html",
	styleUrls: ["empty-list.scss"],
})
export class EmptyListComponent {
	@Input()
	message: string;

	@Output()
	clickButton = new EventEmitter();

	constructor() {}

	submit() {
		this.clickButton.emit();
	}
}
