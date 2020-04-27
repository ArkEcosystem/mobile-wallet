import { Component, Input } from "@angular/core";

@Component({
	selector: "network-card",
	templateUrl: "network-card.component.html",
	styleUrls: ["network-card.pcss"],
})
export class NetworkCardComponent {
	public networkImages = {
		mainet: "ark-mainet",
		devnet: "ark-devnet",
	};

	@Input()
	public name: string;

	@Input()
	public type: string;

	@Input()
	public isSelected: boolean;

	constructor() {}
}
