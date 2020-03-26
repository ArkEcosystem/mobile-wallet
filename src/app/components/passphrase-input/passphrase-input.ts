import { Component, Input, OnInit, ViewChild } from "@angular/core";
import * as bip39 from "bip39";

import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "passphrase-input",
	templateUrl: "passphrase-input.html",
	styleUrls: ["passphrase-input.pcss"],
	providers: [ToastProvider],
})
export class PassphraseInputComponent implements OnInit {
	public passphrase: string;
	public wordSuggestions = [];
	public hidePassphrase = false;
	public passphraseHidden: string;

	@ViewChild("inputPassphrase", { static: true })
	inputPassphrase;
	@ViewChild("inputPassphraseHidden", { static: true })
	inputPassphraseHidden;

	@Input()
	wordlistLanguage: string;
	@Input()
	passphraseInit: string; // used for devnet to fill the words automatically

	public constructor(private toastProvider: ToastProvider) {}

	ngOnInit() {
		if (this.passphraseInit) {
			this.passphraseChange(this.passphraseInit);
		}
	}

	public validatePassphrase(reference?: string): boolean {
		if (this.passphrase && reference) {
			return this.passphrase.trim() === reference.trim();
		}

		return false;
	}

	passphraseChange(value) {
		const lastpassphrase = this.passphrase || "";
		this.passphrase = value;

		this.suggestWord(lastpassphrase, this.passphrase);
		this.updatePassphraseHidden();
	}

	passphraseHiddenChange(value) {
		const lastPassphrase = this.passphrase;
		const lastPassphraseHidden = this.passphraseHidden || "";

		const lengthDiff = value.length - lastPassphraseHidden.length;
		if (lengthDiff < 0) {
			// we removed characters : make sure we removed the trailing chars
			if (lastPassphraseHidden.slice(0, lengthDiff) === value) {
				this.passphrase = this.passphrase.slice(0, lengthDiff);
			} else {
				// we removed some chars inside the passphrase : unsupported in the passphrase hidden mode
				// (because if we removed asterisks, we don't know which letter was behind it and can't update the plain passphrase)
				this.toastProvider.error(
					"WALLETS_PAGE.PASSPHRASE_UNSUPPORTED_INPUT",
				);
			}
		} else {
			// we added characters : just check that asterisks are still there and update the non-asterisk part
			const lastAsterisk = lastPassphraseHidden.lastIndexOf("*");
			if (
				lastPassphraseHidden.slice(0, lastAsterisk + 1) ===
				value.slice(0, lastAsterisk + 1)
			) {
				this.passphrase =
					this.passphrase.slice(0, lastAsterisk + 1) +
					value.slice(lastAsterisk + 1);
			} else {
				// we added characters inside the asterisks part : unsupported (we wouldn't know how to update the plain passphrase)
				this.toastProvider.error(
					"WALLETS_PAGE.PASSPHRASE_UNSUPPORTED_INPUT",
				);
			}
		}

		this.suggestWord(lastPassphrase, this.passphrase);
		this.updatePassphraseHidden();
	}

	updatePassphraseHidden() {
		const wordsPassphrase = (this.passphrase || "").split(" ");
		const tmpPassphraseHidden = [];
		wordsPassphrase.forEach((elem, index, arr) => {
			let value: string;
			if (index === arr.length - 1 && this.wordSuggestions.length) {
				value = elem;
			} else {
				value = "*".repeat(elem.length);
			}
			tmpPassphraseHidden.push(value);
		});
		this.passphraseHidden = tmpPassphraseHidden.join(" ");
	}

	showHidePassphrase() {
		this.hidePassphrase = !this.hidePassphrase;
	}

	suggestWord(lastPassphrase, passphrase) {
		this.wordSuggestions = [];

		if (!passphrase) {
			return;
		}

		const wordsLastPassphrase = lastPassphrase.split(" ");
		const wordsPassphrase = passphrase.split(" ");
		if (wordsLastPassphrase.length !== wordsPassphrase.length) {
			return;
		}
		// don't do anything if we type 1st letter of a new word or if we remove one word

		const lastWordLastPassphrase = wordsLastPassphrase.pop();
		const lastWordPassphrase = wordsPassphrase.pop();
		if (wordsLastPassphrase.join() !== wordsPassphrase.join()) {
			return;
		} // we only want the last word to change

		if (
			Math.abs(
				lastWordLastPassphrase.length - lastWordPassphrase.length,
			) === 1 &&
			lastWordPassphrase.length > 1 &&
			(lastWordLastPassphrase.indexOf(lastWordPassphrase) !== -1 ||
				lastWordPassphrase.indexOf(lastWordLastPassphrase) !== -1)
		) {
			// we just want one letter to be different - only "manual" typing, don't suggest on copy/paste stuff
			const wordlist = bip39.wordlists[this.wordlistLanguage];
			this.wordSuggestions = wordlist.filter(
				(word) =>
					word.startsWith(lastWordPassphrase) &&
					word !== lastWordPassphrase,
			);
		}
	}

	suggestionClick(index) {
		const wordsPassphrase = this.passphrase.split(" ");
		wordsPassphrase[wordsPassphrase.length - 1] = this.wordSuggestions[
			index
		];
		this.passphrase = wordsPassphrase.join(" ");
		this.updatePassphraseHidden();

		this.wordSuggestions = [];
		const inputPassphrase =
			this.inputPassphrase || this.inputPassphraseHidden;
		inputPassphrase.setFocus();
	}
}
