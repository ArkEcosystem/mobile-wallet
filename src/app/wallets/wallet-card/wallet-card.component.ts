import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "wallet-card",
	templateUrl: "wallet-card.component.html",
	styleUrls: ["wallet-card.pcss"],
})
export class WalletCardComponent {
	public coins = {
		ark: "ark",
		btc: "btc",
	};

	@Input()
	public name: string;

	@Input()
	public address: string;

	@Input()
	public balance: string;

	@Input()
	public symbol: string;

	@Input()
	public isSelected: boolean;

	@Output()
	openWalletClick = new EventEmitter();

	constructor() {}

	public openWalletDetailsHandler(address: string) {
		console.log({ address });
		this.openWalletClick.emit();
	}
}
