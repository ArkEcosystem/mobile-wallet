import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import * as constants from "@/app/app.constants";
import { TranslatableObject } from "@/models/translate";

@Injectable({ providedIn: "root" })
export class ToastProvider {
	private hideDelay = constants.TOAST_HIDE_DELAY;
	private position = constants.TOAST_POSITION;

	private typeEnum = {
		ERROR: 0,
		SUCCESS: 1,
		WARN: 2,
		LOG: 3,
		DEBUG: 4,
	};

	private typeName = ["danger", "success", "warning", "medium", "dark"];

	constructor(
		private toastCtrl: ToastController,
		private translateService: TranslateService,
	) {
		translateService.setDefaultLang("en");
		translateService.use("en");
	}

	error(
		message: string | TranslatableObject,
		hideDelay?: number,
		position?: string,
	): void {
		this.show(message, this.typeEnum.ERROR, hideDelay, position);
	}

	success(
		message: string | TranslatableObject,
		hideDelay?: number,
		position?: string,
	): void {
		this.show(message, this.typeEnum.SUCCESS, hideDelay, position);
	}

	warn(
		message: string | TranslatableObject,
		hideDelay?: number,
		position?: string,
	): void {
		this.show(message, this.typeEnum.WARN, hideDelay, position);
	}

	log(
		message: string | TranslatableObject,
		hideDelay?: number,
		position?: string,
	): void {
		this.show(message, this.typeEnum.LOG, hideDelay, position);
	}

	show(
		messageOrObj: string | TranslatableObject,
		type?: number,
		hideDelay?: number,
		position?: string,
	) {
		let message: string;
		let parameters: any;
		if (typeof messageOrObj === "string") {
			message = messageOrObj;
			parameters = null;
		} else {
			const obj = messageOrObj;
			message = obj.key;
			parameters = obj.parameters;
		}
		this.translateService
			.get(message, parameters)
			.subscribe(async (translation) => {
				const toast = await this.toastCtrl.create({
					message: translation,
					duration: hideDelay || this.hideDelay,
					position: (position || this.position) as
						| "top"
						| "bottom"
						| "middle",
					color: this.typeName[type],
				});

				toast.present();
			});
	}
}
