import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "network-list",
	templateUrl: "network-list.component.html",
})
export class NetworkListComponent {
	@Output()
	public addNetworkHandler = new EventEmitter();

	@Input()
	public networks = [];

	constructor() {}

	public handleAddNetwork() {
		this.addNetworkHandler.emit();
	}
}
