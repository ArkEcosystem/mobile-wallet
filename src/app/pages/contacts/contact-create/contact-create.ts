import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { PublicKey } from "ark-ts/core";
import lodash from "lodash";

import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { QRCodeScheme } from "@/models/model";
import { TranslatableObject } from "@/models/translate";
import { ContactsProvider } from "@/services/contacts/contacts";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataProvider } from "@/services/user-data/user-data";

@Component({
	selector: "page-contact-create",
	templateUrl: "contact-create.html",
	styleUrls: ["contact-create.scss"],
})
export class ContactCreatePage implements OnInit {
	@ViewChild("createContactForm", { static: true })
	createContactForm: HTMLFormElement;
	@ViewChild("qrScanner", { read: QRScannerComponent, static: true })
	qrScanner: QRScannerComponent;

	public isNew: boolean;

	public address: string;
	public contactName: string;

	private currentNetwork;

	constructor(
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private userDataProvider: UserDataProvider,
		private contactsProvider: ContactsProvider,
		private translateService: TranslateService,
		private alertCtrl: AlertController,
		private toastProvider: ToastProvider,
	) {}

	ngOnInit() {
		this.currentNetwork = this.userDataProvider.currentNetwork;

		const contact = this.route.snapshot.queryParamMap.get("contact");
		this.address = this.route.snapshot.queryParamMap.get("address");

		this.isNew = lodash.isEmpty(contact);

		if (!this.isNew) {
			const contactMap = JSON.parse(contact);
			this.contactName = contactMap.name;
			this.address = contactMap.address;
		}

		this.currentNetwork = this.userDataProvider.currentNetwork;
	}

	validateAddress() {
		const validate = PublicKey.validateAddress(
			this.address,
			this.currentNetwork,
		);
		this.createContactForm.form.controls.address.setErrors({
			incorrect: !validate,
		});
		if (validate) {
			this.createContactForm.form.controls.address.setErrors(null);
		}

		return validate;
	}

	submitForm() {
		if (!this.validateAddress()) {
			return;
		}

		if (this.isNew) {
			const existingContact = this.contactsProvider.getContactByAddress(
				this.address,
			);
			if (existingContact) {
				this.showConfirmation("CONTACTS_PAGE.OVERWRITE_CONTACT", {
					name: existingContact.name,
					newName: this.contactName,
				}).then(() =>
					this.contactsProvider
						.editContact(existingContact.address, this.contactName)
						.subscribe(
							this.closeAndLoadContactList,
							this.showErrorMessage,
						),
				);
			} else {
				this.contactsProvider
					.addContact(this.address, this.contactName)
					.subscribe(
						this.closeAndLoadContactList,
						this.showErrorMessage,
					);
			}
		} else {
			this.contactsProvider
				.editContact(this.address, this.contactName)
				.subscribe(this.closeAndLoadContactList, this.showErrorMessage);
		}
	}

	scanQRCode() {
		this.qrScanner.open(true);
	}

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address) {
			this.address = qrCode.address;
			this.validateAddress();
			if (qrCode.label) {
				this.contactName = qrCode.label;
			}
		} else {
			this.toastProvider.error("QR_CODE.INVALID_QR_ERROR");
		}
	}

	private closeAndLoadContactList = (): void => {
		this.navCtrl.navigateForward("/contacts", { replaceUrl: true });
	};

	private showErrorMessage = (error: TranslatableObject): void => {
		this.toastProvider.error(error, 5000);
	};

	private showConfirmation(
		titleKey: string,
		stringParams: any,
	): Promise<void> {
		return new Promise(resolve => {
			this.translateService
				.get([titleKey, "NO", "YES"], stringParams)
				.subscribe(async translation => {
					const alert = await this.alertCtrl.create({
						subHeader: translation[titleKey],
						buttons: [
							{
								text: translation.NO,
								role: "cancel",
								handler: () => {},
							},
							{
								text: translation.YES,
								handler: () => resolve(),
							},
						],
					});

					alert.present();
				});
		});
	}
}
