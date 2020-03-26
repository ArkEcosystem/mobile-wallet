import { Component } from "@angular/core";
import {
	ActionSheetController,
	AlertController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AddressMap } from "@/models/contact";
import { ContactsProvider } from "@/services/contacts/contacts";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-contact-list",
	templateUrl: "contact-list.html",
	styleUrls: ["contact-list.scss"],
})
export class ContactListPage {
	public profile;
	public network;
	public addresses: AddressMap[];

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		private navCtrl: NavController,
		private userDataService: UserDataService,
		private contactsProvider: ContactsProvider,
		private translateService: TranslateService,
		private alertCtrl: AlertController,
		private actionSheetCtrl: ActionSheetController,
	) {}

	ionViewDidEnter(): void {
		this._load();
	}

	presentContactActionSheet(address) {
		this.translateService
			.get(["EDIT", "DELETE"])
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(async (translation) => {
				const buttons = [
					{
						text: translation.EDIT,
						role: "label",
						icon: "create",
						handler: () => {
							this.openEditPage(address);
						},
					},
					{
						text: translation.DELETE,
						role: "label",
						icon: "trash",
						handler: () => {
							this.showDeleteConfirm(address);
						},
					},
				];

				const action = await this.actionSheetCtrl.create({ buttons });
				action.present();
			});
	}

	showDeleteConfirm(address) {
		const contactName = this.contactsProvider.getContactByAddress(address)
			.name;
		this.translateService
			.get(
				[
					"CANCEL",
					"CONFIRM",
					"ARE_YOU_SURE",
					"CONTACTS_PAGE.DELETE_CONTACT",
				],
				{ name: contactName },
			)
			.subscribe(async (translation) => {
				const alert = await this.alertCtrl.create({
					header: translation.ARE_YOU_SURE,
					message: translation["CONTACTS_PAGE.DELETE_CONTACT"],
					buttons: [
						{
							text: translation.CANCEL,
						},
						{
							text: translation.CONFIRM,
							handler: () => {
								this.delete(address);
							},
						},
					],
				});

				alert.present();
			});
	}

	isEmpty() {
		return lodash.isEmpty(this.addresses);
	}

	delete(address) {
		this.contactsProvider.removeContactByAddress(address);
		this._load();
	}

	openEditPage(address) {
		const contact = this.contactsProvider.getContactByAddress(address);

		return this.navCtrl.navigateForward("/contacts/create", {
			queryParams: {
				contact: JSON.stringify(contact),
			},
		});
	}

	openCreatePage() {
		return this.navCtrl.navigateForward("/contacts/create");
	}

	private _load() {
		this.profile = this.userDataService.currentProfile;
		this.network = this.userDataService.currentNetwork;

		this.addresses = lodash(this.profile.contacts)
			.mapValues("name")
			.transform((result, key, value) => {
				result.push({ index: value, value, key, hasMore: true });
			}, [])
			.value()
			.sort((a, b) => a.key.localeCompare(b.key));
	}
}
