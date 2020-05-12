import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "wallet-list-header",
	templateUrl: "wallet-list-header.component.html",
	styleUrls: ["wallet-list-header.component.scss"],
})
export class WalletListHeaderComponent {
	@Input()
	public name: string;

	@Input()
	public orientation: string;

	@Input()
	public currencySymbol: string;

	@Input()
	public totalBalance: string;

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
