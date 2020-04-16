import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";

import { DelegateSearchComponent } from "./delegate-search.component";

@Injectable()
export class DelegateSearchController {
	constructor(private modalCtrl: ModalController) {}

	public async open() {
		const modal = await this.modalCtrl.create({
			component: DelegateSearchComponent,
			swipeToClose: true,
			mode: "ios",
			presentingElement: document.querySelector("body"),
		});
		modal.present();
	}
}
