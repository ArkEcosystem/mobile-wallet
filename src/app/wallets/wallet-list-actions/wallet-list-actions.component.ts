import { Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "wallet-list-actions",
	templateUrl: "wallet-list-actions.component.html",
})
export class WalletListActionsComponent {
	@Output()
	public importWalletClick = new EventEmitter();

	@Output()
	public generateWalletClick = new EventEmitter();

	constructor() {}

	public importWalletHandler() {
		this.importWalletClick.emit();
	}

	public generateWalletHandler() {
		this.generateWalletClick.emit();
	}
}
