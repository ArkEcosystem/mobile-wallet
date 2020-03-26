import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ActionSheetController, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { StoredNetwork, Wallet } from "@/models/model";
import { TransactionEntity } from "@/models/transaction";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";
import { ContactsProvider } from "@/services/contacts/contacts";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-transaction-show",
	templateUrl: "transaction-show.html",
	styleUrls: ["transaction-show.pcss"],
	providers: [InAppBrowser, TruncateMiddlePipe],
})
export class TransactionShowPage {
	public transaction: TransactionEntity;
	public equivalentAmount: string;
	public equivalentSymbol: string;

	public showOptions = false;
	public currentNetwork: StoredNetwork;
	private currentWallet: Wallet;

	constructor(
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private userDataService: UserDataService,
		private contactsProvider: ContactsProvider,
		private inAppBrowser: InAppBrowser,
		private actionSheetCtrl: ActionSheetController,
		private translateService: TranslateService,
		private truncateMiddlePipe: TruncateMiddlePipe,
	) {
		this.currentNetwork = this.userDataService.currentNetwork;
		this.currentWallet = this.userDataService.currentWallet;

		const transaction = this.route.snapshot.queryParamMap.get(
			"transaction",
		);
		this.equivalentAmount = this.route.snapshot.queryParamMap.get(
			"equivalentAmount",
		);
		this.equivalentSymbol = this.route.snapshot.queryParamMap.get(
			"equivalentSymbol",
		);

		if (!transaction) {
			this.navCtrl.pop();
		}

		const transactionMap = JSON.parse(transaction);
		this.transaction = transactionMap;
		this.shouldShowOptions();
	}

	openInExplorer() {
		const url = `${this.currentNetwork.explorer}/transaction/${this.transaction.id}`;
		return this.inAppBrowser.create(url, "_system");
	}

	presentOptions() {
		const address = this.transaction.appropriateAddress;
		const addressTruncated = this.truncateMiddlePipe.transform(
			address,
			10,
			null,
		);
		const contact = this.contactsProvider.getContactByAddress(address);
		const contactOrAddress = contact ? contact.name : addressTruncated;

		this.translateService
			.get(
				[
					"TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS",
					"TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS",
				],
				{ address: contactOrAddress, token: this.currentNetwork.token },
			)
			.subscribe(async (translation) => {
				const buttons = [];

				if (!contact) {
					buttons.push({
						text:
							translation[
								"TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS"
							],
						role: "contact",
						icon: "person-add",
						handler: () => {
							this.addToContacts(address);
						},
					});
				}

				if (this.currentWallet && !this.currentWallet.isWatchOnly) {
					buttons.push({
						text:
							translation[
								"TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS"
							],
						role: "send",
						icon: "send",
						handler: () => {
							this.sendToAddress(address);
						},
					});
				}

				const action = await this.actionSheetCtrl.create({ buttons });
				action.present();
			});
	}

	addToContacts(address: string) {
		this.navCtrl.navigateForward("/contacts/create", {
			queryParams: {
				address,
			},
		});
	}

	sendToAddress(address: string) {
		this.navCtrl.navigateForward("/transaction/send", {
			queryParams: {
				address,
			},
		});
	}

	private shouldShowOptions() {
		if (this.transaction.isTransfer) {
			const contact = this.contactsProvider.getContactByAddress(
				this.transaction.appropriateAddress,
			);
			if (
				!contact ||
				(this.currentWallet && !this.currentWallet.isWatchOnly)
			) {
				return (this.showOptions = true);
			}
		}
	}
}
