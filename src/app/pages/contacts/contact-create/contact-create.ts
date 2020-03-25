import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-contact-create",
	templateUrl: "contact-create.html",
	styleUrls: ["contact-create.scss"],
})
export class ContactCreatePage implements OnInit, AfterViewInit {
	@ViewChild("qrScanner", { read: QRScannerComponent, static: true })
	qrScanner: QRScannerComponent;

	public isNew: boolean;

	public formGroup: FormGroup;

	private currentNetwork;

	constructor(
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private userDataService: UserDataService,
		private contactsProvider: ContactsProvider,
		private translateService: TranslateService,
		private alertCtrl: AlertController,
		private toastProvider: ToastProvider,
	) {}

	ngOnInit() {
		this.formGroup = new FormGroup({
			name: new FormControl("", [Validators.required]),
			address: new FormControl("", [Validators.required]),
		});
	}

	ngAfterViewInit() {
		this.currentNetwork = this.userDataService.currentNetwork;

		const contactRaw = this.route.snapshot.queryParamMap.get("contact");
		let address = this.route.snapshot.queryParamMap.get("address");
		let name;

		this.isNew = lodash.isEmpty(contactRaw);

		if (!this.isNew) {
			const contactMap = JSON.parse(contactRaw);
			name = contactMap.name;
			address = contactMap.address;
		}

		this.currentNetwork = this.userDataService.currentNetwork;
		this.formGroup.patchValue({
			name: name || "",
			address: address || "",
		});
		this.formGroup.valueChanges.subscribe(x =>
			console.log(1, x, this.formGroup),
		);
	}

	validateAddress() {
		const validate = PublicKey.validateAddress(
			this.formGroup.get("address").value,
			this.currentNetwork,
		);
		this.formGroup.controls.address.setErrors({
			incorrect: !validate,
		});
		if (validate) {
			this.formGroup.controls.address.setErrors(null);
		}

		return validate;
	}

	submitForm() {
		if (!this.validateAddress()) {
			return;
		}
		const address = this.formGroup.get("address").value;
		const name = this.formGroup.get("name").value;

		if (this.isNew) {
			const existingContact = this.contactsProvider.getContactByAddress(
				address,
			);
			if (existingContact) {
				this.showConfirmation("CONTACTS_PAGE.OVERWRITE_CONTACT", {
					name: existingContact.name,
					newName: name,
				}).then(() =>
					this.contactsProvider
						.editContact(existingContact.address, name)
						.subscribe(
							this.closeAndLoadContactList,
							this.showErrorMessage,
						),
				);
			} else {
				this.contactsProvider
					.addContact(address, name)
					.subscribe(
						this.closeAndLoadContactList,
						this.showErrorMessage,
					);
			}
		} else {
			this.contactsProvider
				.editContact(address, name)
				.subscribe(this.closeAndLoadContactList, this.showErrorMessage);
		}
	}

	scanQRCode() {
		this.qrScanner.open(true);
	}

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address) {
			this.formGroup.get("address").setValue(qrCode.address);
			this.validateAddress();
			if (qrCode.label) {
				this.formGroup.get("name").setValue(qrCode.label);
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
