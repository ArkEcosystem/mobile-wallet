import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "empty-list",
	templateUrl: "wallet-empty-list.component.html",
})
export class WalletEmptyListComponent {
	@Input()
	message: string;

	@Input()
	name: string;

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
