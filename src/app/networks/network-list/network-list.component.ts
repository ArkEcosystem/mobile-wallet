import { Component, Input } from "@angular/core";

@Component({
	selector: "network-list",
	templateUrl: "network-list.component.html",
})
export class NetworkListComponent {
	@Input()
	public networks = [];

	constructor() {}
}
