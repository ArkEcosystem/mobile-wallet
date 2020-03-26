import { Component, Input } from "@angular/core";

export interface Log {
	time: number;
	level: number;
	msg: string;
}

@Component({
	selector: "viewer-log",
	templateUrl: "viewer-log.component.html",
})
export class ViewerLogComponent {
	@Input()
	public logs: Log[];

	constructor() {}
}
