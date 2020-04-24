import { Component, Input } from "@angular/core";

@Component({
	selector: "network-card",
	templateUrl: "network-card.component.html",
	styleUrls: ["network-card.pcss"],
})
export class NetworkCardComponent {
	@Input()
	name: string;

	@Input()
	type: string;

	@Input()
	isSelected: boolean;

	constructor() {}
}
