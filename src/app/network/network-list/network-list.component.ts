import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "network-list",
	templateUrl: "network-list.component.html",
})
export class NetworkListComponent {
	@Output()
	addNetworkClick = new EventEmitter();

	@Input()
	networks = [];

	constructor() {}

	public addNetworkHandler() {
		this.addNetworkClick.emit();
	}
}
