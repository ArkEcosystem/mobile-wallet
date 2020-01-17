import { Component, OnInit } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";

import { ArkApiProvider } from "@/services/ark-api/ark-api";

import { Fees, Network } from "ark-ts";
import * as bip39 from "bip39";

@Component({
	selector: "page-register-second-passphrase",
	templateUrl: "register-second-passphrase.html",
	styleUrls: ["register-second-passphrase.scss"],
})
export class RegisterSecondPassphrasePage implements OnInit {
	public passphrase: string;
	public repassphrase: string;
	public fees: Fees;
	public currentNetwork: Network;

	public step = 1;
	public isWrong = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private arkApiProvider: ArkApiProvider,
	) {}

	prev() {
		this.step -= 1;
	}

	next() {
		this.repassphrase = undefined;
		this.isWrong = false;
		this.step += 1;
	}

	create() {
		if (this.passphrase !== this.repassphrase) {
			this.isWrong = true;
			return;
		}

		this.dismiss(this.passphrase);
	}

	dismiss(result?: any) {
		this.modalCtrl.dismiss(result);
	}

	ngOnInit() {
		this.passphrase = bip39.generateMnemonic();
		this.currentNetwork = this.arkApiProvider.network;
		this.arkApiProvider.fees.subscribe(fees => (this.fees = fees));
	}
}
