import { Component, Input, ViewChild } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";

import { PassphraseInputComponent } from "@/components/passphrase-input/passphrase-input";
import { UserDataProvider } from "@/services/user-data/user-data";

@Component({
	selector: "modal-passphrase-word-tester",
	templateUrl: "passphrase-word-tester.html",
	styleUrls: ["passphrase-word-tester.scss"],
})
export class PassphraseWordTesterModal {
	@Input()
	public passphraseReference: string;

	@Input()
	public wordlistLanguage: string;

	public passphraseInit: string;
	public isDevNet: boolean;

	@ViewChild("passphrase", { read: PassphraseInputComponent, static: true })
	passphraseInput: PassphraseInputComponent;

	public constructor(
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		private userDataProvider: UserDataProvider,
	) {
		if (!this.passphraseReference) {
			this.dismiss();
		}

		this.isDevNet = this.userDataProvider.isDevNet;
		if (this.isDevNet) {
			this.passphraseInit = this.passphraseReference;
		}
	}

	public areAllWordsCorrect(): boolean {
		return this.passphraseInput.validatePassphrase(
			this.passphraseReference,
		);
	}

	public next(): void {
		this.dismiss(this.areAllWordsCorrect());
	}

	public dismiss(validationSuccess?: boolean): void {
		this.modalCtrl.dismiss(validationSuccess);
	}
}
