import { Component, OnDestroy } from "@angular/core";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { Vibration } from "@ionic-native/vibration/ngx";
import { ModalController } from "@ionic/angular";

import * as constants from "@/app/app.constants";
import { EventBusProvider } from "@/services/event-bus/event-bus";
import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "modal-qr-scanner",
	templateUrl: "qr-scanner.html",
	styleUrls: ["qr-scanner.scss"],
	providers: [Vibration],
})
export class QRScannerModal implements OnDestroy {
	constructor(
		private eventBus: EventBusProvider,
		private qrScanner: QRScanner,
		private toastProvider: ToastProvider,
		private modalCtrl: ModalController,
		private vibration: Vibration,
	) {
		this.scanQrCode();
	}

	public dismiss(qrCode: object = null) {
		this.qrScanner.getStatus().then((status: QRScannerStatus) => {
			if (status.showing) {
				this.hideCamera();
			}
		});

		this.modalCtrl.dismiss(qrCode);
	}

	ngOnDestroy() {
		this.hideCamera();
		this.qrScanner.destroy();
	}

	private scanQrCode(): void {
		this.qrScanner
			.prepare()
			.then((status: QRScannerStatus) => {
				if (status.authorized) {
					const scanSub = this.qrScanner
						.scan()
						.subscribe((qrCode: string) => {
							this.vibration.vibrate(constants.VIBRATION_TIME_MS);

							let response;

							try {
								response = JSON.parse(qrCode);
							} catch {
								response = qrCode;
							}

							this.hideCamera();
							scanSub.unsubscribe();
							this.dismiss(response);
						});

					this.showCamera();
				} else if (status.denied) {
					this.toastProvider.error(
						"QR_CODE.PERMISSION_PERMANENTLY_DENIED",
					);
					this.dismiss();
					this.qrScanner.openSettings();
				} else {
					this.toastProvider.error("QR_CODE.PERMISSION_DENIED");
					this.dismiss();
				}
			})
			.catch(() => {
				this.toastProvider.error("QR_CODE.PROBLEM_TEXT");
				this.dismiss();
			});
	}

	private showCamera() {
		const rootElement = document.getElementsByTagName(
			"html",
		)[0] as HTMLElement;
		rootElement.classList.add("qr-scanner-open");
		this.qrScanner.show();
		this.eventBus.emit("qrScanner:show");
	}

	private hideCamera() {
		const rootElement = document.getElementsByTagName(
			"html",
		)[0] as HTMLElement;
		rootElement.classList.remove("qr-scanner-open");
		this.qrScanner.hide();
		this.eventBus.emit("qrScanner:hide");
	}
}
