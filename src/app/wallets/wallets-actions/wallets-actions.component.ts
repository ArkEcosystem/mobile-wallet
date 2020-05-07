import { Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "wallets-actions",
	templateUrl: "wallets-actions.component.html",
})
export class WalletsActionsComponent {
	@Output()
	importWalletClick = new EventEmitter();

	@Output()
	generateWalletClick = new EventEmitter();

	constructor() {}

	public importWalletHandler() {
		this.importWalletClick.emit();
	}

	public generateWalletHandler() {
		this.generateWalletClick.emit();
	}
}
