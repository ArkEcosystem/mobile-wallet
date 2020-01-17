import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
	selector: "modal-enter-second-passphrase",
	templateUrl: "enter-second-passphrase.html",
})
export class EnterSecondPassphraseModal {
	public passphrase: string;
	public displayType = "text";
	public iconName = "eye";

	constructor(private modalCtrl: ModalController) {}

	submit() {
		this.dismiss(this.passphrase);
	}

	hideShow() {
		this.displayType = this.displayType === "text" ? "password" : "text";
		this.iconName = this.iconName === "eye-off" ? "eye" : "eye-off";
	}

	dismiss(passphrase?: string) {
		this.modalCtrl.dismiss(passphrase);
	}
}
