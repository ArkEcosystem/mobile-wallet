import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "empty-list",
	templateUrl: "empty-list.html",
	styleUrls: ["empty-list.scss"],
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
