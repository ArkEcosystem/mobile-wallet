import { Component } from "@angular/core";

@Component({
	selector: "networks",
	templateUrl: "networks.component.html",
})
export class NetworksComponent {
	public networks = [];

	constructor() {}

	public handleNetworkAdd() {
		console.log("Add network handler");
	}

	public handleSearch() {
		console.log("Network search handler");
	}
}
