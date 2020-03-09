import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";

import { BaseWalletImport } from "@/app/pages/wallet/wallet-import/wallet-import.base";
import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { QRCodeScheme } from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NetworkProvider } from "@/services/network/network";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-wallet-import",
	templateUrl: "wallet-import.html",
	styleUrls: ["wallet-import.scss"],
})
export class WalletImportPage extends BaseWalletImport implements OnInit {
	@ViewChild("qrScanner", { read: QRScannerComponent, static: true })
	qrScanner: QRScannerComponent;

	constructor(
		route: ActivatedRoute,
		navCtrl: NavController,
		userDataProvider: UserDataService,
		arkApiProvider: ArkApiProvider,
		toastProvider: ToastProvider,
		modalCtrl: ModalController,
		networkProvider: NetworkProvider,
		settingsDataProvider: SettingsDataProvider,
	) {
		super(
			route,
			navCtrl,
			userDataProvider,
			arkApiProvider,
			toastProvider,
			modalCtrl,
			networkProvider,
			settingsDataProvider,
		);
	}

	ngOnInit() {
		this.scanQRCode();
	}

	openManualImportPage(type: string) {
		this.navCtrl.navigateForward("/wallets/import-manual", {
			queryParams: {
				type,
				address: this.existingAddress,
			},
		});
	}

	scanQRCode() {
		this.qrScanner.open(true);
	}

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address || qrCode.passphrase) {
			this.import(
				qrCode.address || null,
				qrCode.passphrase || null,
			).subscribe();
		} else {
			this.toastProvider.error("QR_CODE.INVALID_QRCODE");
		}
	}
}
