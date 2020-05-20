import { Component, Input } from "@angular/core";

@Component({
	selector: "wallet-passphrase-list",
	templateUrl: "wallet-passphrase-list.component.html",
	styleUrls: ["wallet-passphrase-list.component.scss"],
})
export class WalletPassphraseListComponent {
	@Input()
	public words: Array<string> = [];

	constructor() {}
}
