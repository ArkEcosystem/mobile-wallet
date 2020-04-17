import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Delegate } from "../shared/delegate.types";

@Component({
	selector: "delegate-list",
	templateUrl: "delegate-list.component.html",
	styleUrls: ["delegate-list.component.pcss"],
})
export class DelegateListComponent {
	@Input()
	public delegates: Delegate[];

	@Input()
	public showIdenticon = true;

	@Output()
	public delegateListClick = new EventEmitter<Delegate>();

	constructor() {}

	public handleClick(delegate: Delegate) {
		this.delegateListClick.emit(delegate);
	}
}
