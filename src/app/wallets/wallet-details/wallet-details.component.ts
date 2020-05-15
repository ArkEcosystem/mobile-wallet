import { Component, Input } from "@angular/core";

// Coin Config
import CoinConfig from "@@/src/coins/shared/coin.config";
import { Transaction } from "@/models/model";

@Component({
	selector: "wallet-details",
	templateUrl: "wallet-details.component.html",
	styleUrls: ["wallet-details.component.scss"],
})
export class WalletDetailsComponent {
	public coinConfig = CoinConfig;
	public transactionsOpen: boolean = false;

	@Input()
	public address: string;

	@Input()
	public balance: string;

	@Input()
	public currency: string;

	@Input()
	public transactions: Transaction[] = [];

	constructor() {}

	convertWalletBalance(balance: string) {
		return "389987";
	}
}
