import { Component, Input, OnInit } from "@angular/core";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { ModalController } from "@ionic/angular";

import { LoggerService } from "@/services/logger/logger.service";
import { ToastProvider } from "@/services/toast/toast";

import { Log } from "./viewer-log.component";

@Component({
	selector: "viewer-log-modal",
	templateUrl: "viewer-log.modal.html",
	providers: [Clipboard],
})
export class ViewerLogModal implements OnInit {
	@Input()
	public logs: Log[] = [];

	constructor(
		private loggerService: LoggerService,
		private modalCtrl: ModalController,
		private clipboard: Clipboard,
		private toastProvider: ToastProvider,
	) {}

	ngOnInit() {
		if (!this.logs.length) {
			this.logs = this.loggerService.logs;
		}
	}

	handleExport() {
		const raw = JSON.stringify(this.logs, null, 1);
		this.clipboard.copy(raw).then(
			() => {
				this.toastProvider.log("COPIED_CLIPBOARD");
			},
			(error) => this.toastProvider.error(error),
		);
	}

	dismiss() {
		this.modalCtrl.dismiss();
	}
}
