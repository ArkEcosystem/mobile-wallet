import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Contact } from "@/models/model";

@Component({
	selector: "wallet-picker",
	templateUrl: "wallet-picker.component.html",
	styleUrls: ["wallet-picker.component.pcss"],
})
export class WalletPickerComponent {
	@Input()
	public title: string;

	@Input()
	public wallets: Contact[];

	@Input()
	public symbol: string;

	@Output()
	public walletPickerPick = new EventEmitter<Contact>();

	constructor() {}

	onTap(wallet: Contact) {
		this.walletPickerPick.emit(wallet);
	}
}
