import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "network-list",
	templateUrl: "network-list.component.html",
})
export class NetworkListComponent {
	@Output()
	public addNetworkClick = new EventEmitter();

	@Input()
	public networks = [];

	constructor() {}

	public addNetworkHandler() {
		this.addNetworkClick.emit();
	}
}
