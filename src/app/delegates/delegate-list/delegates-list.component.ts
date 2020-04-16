import { Component, Input } from "@angular/core";

import { Delegate } from "../shared/delegate.types";

@Component({
	selector: "delegates-list",
	templateUrl: "delegates-list.component.html",
	styleUrls: ["delegates-list.component.pcss"],
})
export class DelegatesListComponent {
	@Input()
	public delegates: Delegate[];

	@Input()
	public showIdenticon = true;

	constructor() {}
}
