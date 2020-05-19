import { Component, Input } from "@angular/core";

// Coin Config
import CoinConfig from "@@/src/coins/shared/coin.config";

@Component({
	selector: "word-box",
	templateUrl: "word-box.component.html",
	styleUrls: ["word-box.component.scss"],
})
export class WordBoxComponent {
	public coinConfig = CoinConfig;

	@Input()
	public order: number;

	@Input()
	public word: string;

	constructor() {}
}
