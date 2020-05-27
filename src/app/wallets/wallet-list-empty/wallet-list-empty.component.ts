import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "wallet-list-empty",
	templateUrl: "wallet-list-empty.component.html",
})
export class WalletListEmptyComponent {
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
