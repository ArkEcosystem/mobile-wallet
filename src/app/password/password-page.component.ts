import { Component, Input } from "@angular/core";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { NavController } from "@ionic/angular";

import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "password-page",
	templateUrl: "password-page.component.html",
	styleUrls: ["password-page.component.scss"],
	providers: [Clipboard],
})
export class PasswordPageComponent {
	@Input()
	public words: Array<string> = [];

	constructor(
		private navCtrl: NavController,
		private clipboard: Clipboard,
		private toastProvider: ToastProvider,
	) {}

	handleNextAction() {
		this.navCtrl.navigateForward("/password/check");
	}

	copyWordsToClipboard() {
		this.clipboard.copy(this.words.join(" ")).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}
}
