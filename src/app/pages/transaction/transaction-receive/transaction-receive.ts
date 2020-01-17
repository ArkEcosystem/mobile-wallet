import { Component } from "@angular/core";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { NavController } from "@ionic/angular";

import { ToastProvider } from "@/services/toast/toast";
import { ActivatedRoute } from "@angular/router";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Component({
	selector: "page-transaction-receive",
	templateUrl: "transaction-receive.html",
	styleUrls: ["transaction-receive.scss"],
	providers: [Clipboard],
})
export class TransactionReceivePage {
	public address;
	public qraddress: any;
	public tokenParam: any;
	public amount: number;

	constructor(
		public navCtrl: NavController,
		public route: ActivatedRoute,
		private clipboard: Clipboard,
		private toastProvider: ToastProvider,
		private socialSharing: SocialSharing,
	) {
		this.address = this.route.snapshot.queryParamMap.get("address");
		this.tokenParam = {
			Token: this.route.snapshot.queryParamMap.get("token"),
		};

		this.qraddress = `'{"a": "${this.address}"}'`;
	}

	copyAddress() {
		this.clipboard.copy(this.address).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}

	setAmount(amount: number) {
		this.amount = amount;
	}

	share() {
		this.socialSharing
			.share(this.address)
			.then(null, error => this.toastProvider.error(error));
	}
}
