import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Wallet } from "@/models/model";

@Component({
	selector: "wallet-list",
	templateUrl: "wallet-list.component.html",
})
export class WalletListComponent {
	@Input()
	name: string;

	@Input()
	wallets: Wallet[] = [];

	@Input()
	totalBalance: number;

	@Input()
	headerOrientation: string = "vertical";

	@Input()
	currencySymbol: string = "$";

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

	public navigateToWalletDetails(address: string) {
		//TODO:
		console.log("navigating to:", { address });
	}
}
