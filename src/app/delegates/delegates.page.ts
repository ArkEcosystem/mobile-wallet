import { Component } from "@angular/core";

import { DelegateSearchController } from "./delegate-search/delegate-search.controller";
import { Delegate } from "./shared/delegate.types";

@Component({
	templateUrl: "delegates.page.html",
	styleUrls: ["delegates.page.pcss"],
})
export class DelegatesPage {
	public delegates: Delegate[] = [];

	constructor(public delegateSearchController: DelegateSearchController) {}
}
