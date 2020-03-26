import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";

import { PassphraseInputComponent } from "@/components/passphrase-input/passphrase-input";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "modal-passphrase-word-tester",
	templateUrl: "passphrase-word-tester.html",
	styleUrls: ["passphrase-word-tester.scss"],
})
export class PassphraseWordTesterModal implements OnInit {
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
		private userDataService: UserDataService,
	) {}

	ngOnInit() {
		if (!this.passphraseReference) {
			this.dismiss();
		}

		this.isDevNet = this.userDataService.isDevNet;
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
