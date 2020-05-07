import { Component, EventEmitter, Input, Output } from "@angular/core";

// Coin Config
import coinConfig from "@@/src/coins/shared/coin.config";

@Component({
	selector: "wallet-card",
	templateUrl: "wallet-card.component.html",
	styleUrls: ["wallet-card.pcss"],
})
export class WalletCardComponent {
	@Input()
	public name: string;

	@Input()
	public address: string;

	@Input()
	public balance: string;

	@Input()
	public currency: string;

	@Input()
	public isSelected: boolean;

	@Output()
	openWalletClick = new EventEmitter();

	constructor() {}

	public openWalletDetailsHandler(address: string) {
		console.log({ address });
		this.openWalletClick.emit();
	}

	public getBackgroundColor(currency: string) {
		return coinConfig[currency].color;
	}
}
