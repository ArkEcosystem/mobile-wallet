import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { NavController } from "@ionic/angular";

import { ToastProvider } from "@/services/toast/toast";
import BigNumber from "@/utils/bignumber";

@Component({
	selector: "page-transaction-receive",
	templateUrl: "transaction-receive.html",
	styleUrls: ["transaction-receive.scss"],
	providers: [Clipboard],
})
export class TransactionReceivePage implements OnInit {
	public address;
	public qraddress: any;
	public tokenParam: any;
	public amount: number;
	public formGroup = new FormGroup({
		amount: new FormControl(""),
	});

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

	ngOnInit() {
		this.formGroup.controls.amount.valueChanges.subscribe(
			(value: BigNumber) => (this.amount = value.toNumber()),
		);
	}

	copyAddress() {
		this.clipboard.copy(this.address).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}

	share() {
		this.socialSharing
			.share(this.address)
			.then(null, (error) => this.toastProvider.error(error));
	}
}
