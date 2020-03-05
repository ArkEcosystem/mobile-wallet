import { Component, EventEmitter, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import * as bip39 from "bip39";
import lodash from "lodash";

import * as constants from "@/app/app.constants";
import { QRScannerModal } from "@/app/modals/qr-scanner/qr-scanner";
import { QRCodeScheme } from "@/models/model";

@Component({
	selector: "qr-scanner",
	templateUrl: "qr-scanner.html",
})
export class QRScannerComponent {
	@Output()
	success: EventEmitter<any> = new EventEmitter();

	@Output()
	wrong: EventEmitter<void> = new EventEmitter();

	constructor(private modalCtrl: ModalController) {}

	async open(format: boolean = false) {
		const modal = await this.modalCtrl.create({
			component: QRScannerModal,
		});

		modal.onDidDismiss().then(({ data: qrCode }) => {
			if (lodash.isNil(qrCode)) {
				return this.wrong.emit();
			}

			let response = qrCode;

			if (format) {
				response = this.formatScheme(qrCode);
			}

			return this.success.emit(response);
		});

		modal.present();
	}

	private formatScheme(qrCode: any): QRCodeScheme {
		if (lodash.isObject(qrCode)) {
			return this.formatOld(qrCode);
		}

		const scheme: QRCodeScheme = {};
		const prefixUriRegex = new RegExp(
			`${constants.URI_QRCODE_SCHEME_PREFIX}([0-9a-zA-Z]{34})`,
			"g",
		);

		if (qrCode.match(prefixUriRegex)) {
			scheme.address = prefixUriRegex.exec(qrCode)[1];
			const paramsRegex = new RegExp(`(\\?|\\&)([^=]+)\\=([^&]+)`, "g");
			let regexResult;
			// tslint:disable-next-line: no-conditional-assignment
			while ((regexResult = paramsRegex.exec(qrCode)) != null) {
				switch (regexResult[2]) {
					case "amount":
						scheme.amount = regexResult[3];
						break;
					case "vendorField":
						scheme.vendorField = regexResult[3];
						break;
					case "label":
						scheme.label = regexResult[3];
						break;
				}
			}
		} else {
			if (bip39.validateMnemonic(qrCode)) {
				scheme.passphrase = qrCode;
			} else if (qrCode.match(/[0-9a-zA-Z]{34}/g)) {
				scheme.address = qrCode;
			}

			this.wrong.emit();
		}

		// TODO: Format params

		return scheme;
	}

	private formatOld(json): QRCodeScheme {
		const scheme: QRCodeScheme = {};

		if (json.a || json.address) {
			scheme.address = json.a || json.address;
		}

		if (json.p || json.passphrase) {
			scheme.passphrase = json.p || json.passphrase;
		}

		return scheme;
	}
}
