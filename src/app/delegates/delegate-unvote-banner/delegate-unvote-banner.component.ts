import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "delegate-unvote-banner",
	templateUrl: "delegate-unvote-banner.component.html",
	styleUrls: ["delegate-unvote-banner.component.pcss"],
})
export class DelegateUnvoteBannerComponent {
	@Input()
	public username: string;

	@Output()
	public delegateUnvoteBannerClick = new EventEmitter();

	constructor() {}

	public handleClick() {
		this.delegateUnvoteBannerClick.emit(this.username);
	}
}
