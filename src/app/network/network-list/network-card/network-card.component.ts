import { Component, Input } from "@angular/core";

@Component({
	selector: "network-card",
	templateUrl: "network-card.component.html",
	styleUrls: ["network-card.pcss"],
})
export class NetworkCardComponent {
	public networkImages = {
		mainet: "logo-no-shadow",
		devnet: "logo-no-shadow-gray",
	};

	@Input()
	public name: string;

	@Input()
	public type: string;

	@Input()
	public isSelected: boolean;

	constructor() {}
}
