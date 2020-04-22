import { Component, Input } from "@angular/core";
import {
	ActionSheetController,
	ModalController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "empty-list",
	templateUrl: "empty-list.html",
	styleUrls: ["empty-list.scss"],
})
export class WalletEmptyListComponent {
	@Input()
	message: string;

	@Input()
	name: string;

	constructor(
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private translateService: TranslateService,
	) {}

	presentWalletImport(role: string) {
		if (role === "qrcode") {
			this.navCtrl.navigateForward("/wallets/import");
		} else {
			this.navCtrl.navigateForward("/wallets/import-manual", {
				queryParams: {
					type: role,
				},
			});
		}
	}

	presentActionSheet() {
		this.translateService
			.get([
				"WALLETS_PAGE.SCAN_QRCODE",
				"IMPORT_PASSPHRASE",
				"IMPORT_ADDRESS",
			])
			.subscribe(async (translation) => {
				const actionSheet = await this.actionSheetCtrl.create({
					buttons: [
						{
							text: translation["WALLETS_PAGE.SCAN_QRCODE"],
							role: "qrcode",
							icon: "qr-code",
							handler: () => {
								this.presentWalletImport("qrcode");
							},
						},
						{
							text: translation.IMPORT_PASSPHRASE,
							role: "passphrase",
							icon: "lock-closed",
							handler: () => {
								this.presentWalletImport("passphrase");
							},
						},
						{
							text: translation.IMPORT_ADDRESS,
							role: "address",
							icon: "globe",
							handler: () => {
								this.presentWalletImport("address");
							},
						},
					],
				});

				actionSheet.present();
			});
	}
}
