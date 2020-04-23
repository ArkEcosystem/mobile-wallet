import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "wallets-empty-list",
	templateUrl: "wallets-empty-list.component.html",
})
export class WalletsEmptyListComponent {
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
