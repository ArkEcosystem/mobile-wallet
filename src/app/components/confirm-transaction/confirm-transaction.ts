import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";

import { ConfirmTransactionModal } from "@/app/modals/confirm-transaction/confirm-transaction";
import {
	Transaction,
	TranslatableObject,
	Wallet,
	WalletKeys,
} from "@/models/model";
import { AddressCheckResult } from "@/services/address-checker/address-check-result";
import { ArkApiProvider } from "@/services/ark-api/ark-api";

@Component({
	selector: "confirm-transaction",
	templateUrl: "confirm-transaction.html",
})
export class ConfirmTransactionComponent {
	@Input()
	wallet: Wallet;

	@Output()
	close: EventEmitter<string> = new EventEmitter();

	@Output()
	error: EventEmitter<string> = new EventEmitter();

	@Output()
	confirm: EventEmitter<Transaction> = new EventEmitter();

	constructor(
		private arkApiProvider: ArkApiProvider,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private translateService: TranslateService,
	) {}

	open(
		transaction: any,
		keys: WalletKeys,
		addressCheckResult?: AddressCheckResult,
		extra = {},
	) {
		transaction = new Transaction(this.wallet.address).deserialize(
			transaction,
		);

		this.arkApiProvider
			.createTransaction(
				transaction,
				keys.key,
				keys.secondKey,
				keys.secondPassphrase,
			)
			.subscribe(
				async (tx) => {
					const modal = await this.modalCtrl.create({
						component: ConfirmTransactionModal,
						componentProps: {
							transaction: tx,
							addressCheckResult,
							extra,
						},
						backdropDismiss: true,
					});

					modal.onDidDismiss().then(({ data }) => {
						if (lodash.isUndefined(data)) {
							return this.close.emit();
						}

						if (!data.status) {
							this.close.emit();

							return this.presentWrongModal(data);
						}

						this.confirm.emit(tx);

						this.navCtrl.navigateForward("/transaction/response", {
							queryParams: {
								transaction: tx,
								keys,
								response: data,
								wallet: this.wallet,
							},
							replaceUrl: true,
						});
					});

					modal.present();
				},
				(error: TranslatableObject) => {
					this.translateService
						.get(
							error.key ||
								(error as any).message ||
								(error as any),
							error.parameters,
						)
						.subscribe((errorMessage) => {
							this.error.emit(errorMessage);
							this.presentWrongModal({
								status: false,
								message: errorMessage,
							});
						});
				},
			);
	}

	async presentWrongModal(response) {
		// TODO:
		// const responseModal = await this.modalCtrl.create({
		//   component: TransactionResponsePage,
		//   componentProps: response
		// });
		// responseModal.present();
	}
}
