import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";

@Component({
	selector: "page-set-label",
	templateUrl: "set-label.html",
})
export class SetLabelPage {
	public label;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
	) {
		this.label = this.navParams.get("label") || "";
	}

	closeModal() {
		this.modalCtrl.dismiss();
	}

	saveLabel() {
		this.modalCtrl.dismiss(this.label, "submit");
	}

	removeLabel() {
		this.modalCtrl.dismiss(null, "submit");
	}
}
