import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Network } from "ark-ts/model";
import lodash from "lodash";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { MarketCurrency, MarketTicker, Transaction } from "@/models/model";
import { AddressCheckResult } from "@/services/address-checker/address-check-result";
import { AddressCheckResultType } from "@/services/address-checker/address-check-result-type";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ArkUtility } from "@/utils/ark-utility";

@Component({
	selector: "modal-confirm-transaction",
	templateUrl: "confirm-transaction.html",
	styleUrls: ["confirm-transaction.pcss"],
})
export class ConfirmTransactionModal implements OnInit, OnDestroy {
	public transaction: Transaction;
	public address: string;
	public extra: any;

	public addressCheckResult: AddressCheckResult;
	public marketCurrency: MarketCurrency;
	public ticker: MarketTicker;
	public currentNetwork: Network;
	public checkTypes = AddressCheckResultType;
	public hasBroadcast = false;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		private arkApiProvider: ArkApiProvider,
		private marketDataProvider: MarketDataProvider,
		private settingsDataProvider: SettingsDataProvider,
		private ngZone: NgZone,
		private translateService: TranslateService,
	) {}

	broadcast() {
		if (this.hasBroadcast) {
			return;
		}

		this.ngZone.run(() => {
			this.hasBroadcast = true;
			this.arkApiProvider.postTransaction(this.transaction).subscribe(
				() => {
					this.dismiss(true);
				},
				(error) => {
					this.translateService
						.get(
							[
								"TRANSACTIONS_PAGE.ERROR.NOTHING_SENT",
								"TRANSACTIONS_PAGE.ERROR.FEE_TOO_LOW",
							],
							{ fee: ArkUtility.subToUnit(this.transaction.fee) },
						)
						.subscribe((translations) => {
							let message = error.message;

							if (error.errors) {
								const errors = error.errors || {};
								const anyLowFee = Object.keys(errors).some(
									(transactionId) => {
										return errors[transactionId].some(
											(item) =>
												item.type === "ERR_LOW_FEE",
										);
									},
								);

								if (anyLowFee) {
									message =
										translations[
											"TRANSACTIONS_PAGE.ERROR.FEE_TOO_LOW"
										];
								} else {
									const remoteMessage = lodash.get(
										lodash.values(errors),
										"[0][0].message",
									);
									if (remoteMessage) {
										message = remoteMessage;
									} else {
										message =
											translations[
												"TRANSACTIONS_PAGE.ERROR.NOTHING_SENT"
											];
									}
								}
							}

							this.dismiss(false, message);
						});
				},
			);
		});
	}

	dismiss(status?: boolean, message?: string) {
		if (lodash.isUndefined(status)) {
			return this.modalCtrl.dismiss();
		}

		const response = { status, message };
		this.modalCtrl.dismiss(response);
	}

	ngOnInit() {
		this.address = this.transaction.address;

		if (!this.transaction) {
			this.navCtrl.pop();
		}

		this.currentNetwork = this.arkApiProvider.network;

		this.onUpdateTicker();
		this.marketDataProvider.refreshTicker();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private onUpdateTicker() {
		this.marketDataProvider.onUpdateTicker$
			.pipe(
				takeUntil(this.unsubscriber$),
				tap((ticker) => {
					if (!ticker) {
						return;
					}

					this.ticker = ticker;
					this.settingsDataProvider.settings.subscribe((settings) => {
						this.marketCurrency = this.ticker.getCurrency({
							code: settings.currency,
						});
					});
				}),
			)
			.subscribe();
	}
}
