import { Component, Input, OnInit } from "@angular/core";
import { sampleSize } from "lodash";

import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "wallet-passphrase-check",
	templateUrl: "wallet-passphrase-check.component.html",
	styleUrls: ["wallet-passphrase-check.component.scss"],
})
export class WalletPassphraseCheckComponent implements OnInit {
	@Input()
	public words: Array<string> = [];

	public randomized: Array<string> = [];

	public selectedWord: string = "";

	public suggestions: Array<any> = [];

	public verified: Array<string> = [];

	constructor(private toastProvider: ToastProvider) {}

	ngOnInit() {
		this.getRandomWords();
		this.randomized.map((word) => {
			const suggestions = this.generateSuggestions(word);
			this.suggestions.push({
				word,
				suggestions,
			});
		});

		this.selectedWord = this.randomized[0];
	}

	getRandomWords() {
		const sample = sampleSize(this.words, 3);
		this.randomized = sample;

		return this.randomized;
	}

	generateSuggestions(word) {
		const sample = sampleSize(this.words, 3);

		if (!sample.find((suggestion) => suggestion === word)) {
			return this.generateSuggestions(word);
		}

		return sample;
	}

	isVerified(word) {
		return this.verified.find((verified) => word === verified);
	}

	handleSelectedWord(word) {
		if (word === this.selectedWord) {
			this.verified.push(word);

			if (this.verified.length <= 3) {
				const currentIndex = this.randomized.indexOf(word);

				if (currentIndex <= 3) {
					return (this.selectedWord = this.randomized[
						currentIndex + 1
					]);
				}
			}
		}

		return this.toastProvider.error("PASSPHRASE_TEST.WRONG_WORD");
	}
}
