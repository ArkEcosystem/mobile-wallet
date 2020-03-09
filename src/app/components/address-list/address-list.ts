import { Component, EventEmitter, Input, Output } from "@angular/core";

import { AddressMap } from "@/models/contact";

@Component({
	selector: "address-list",
	templateUrl: "address-list.html",
	styleUrls: ["address-list.pcss"],
})
export class AddressListComponent {
	@Input()
	map: AddressMap[];
	@Input()
	icon: string;
	@Input()
	circleProperty = "key"; // key or value

	@Output()
	tapItem: EventEmitter<string> = new EventEmitter<string>();

	@Output()
	pressItem: EventEmitter<string> = new EventEmitter<string>();

	@Output()
	more: EventEmitter<string> = new EventEmitter<string>();

	constructor() {}

	onTap(key: string) {
		this.tapItem.emit(key);
	}

	onPress(key: string) {
		this.pressItem.emit(key);
	}

	onMore(key: string) {
		this.more.emit(key);
	}
}
