import { Component, OnInit } from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";
import { Network } from "ark-ts/model";

import * as constants from "@/app/app.constants";
import { MarketCurrency } from "@/models/model";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { UserDataService } from "@/services/user-data/user-data.interface";
import BigNumber, { SafeBigNumber } from "@/utils/bignumber";

@Component({
	selector: "input-amount",
	templateUrl: "input-amount.component.html",
	styleUrls: ["input-amount.component.scss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputAmountComponent implements OnInit {
	public tokenFractionDigits = constants.ARKTOSHI_DP;
	public fiatFractionDigits = 2;
	public marketCurrency: MarketCurrency;
	public currentNetwork: Network;

	public constructor(
		private userDataService: UserDataService,
		private marketDataProvider: MarketDataProvider,
		private settingsDataProvider: SettingsDataProvider,
		private parentForm: FormGroupDirective,
	) {
		this.currentNetwork = this.userDataService.currentNetwork;
	}

	public ngOnInit() {
		this.parentForm.form.addControl("amount", new FormControl("amount"));
		this.parentForm.form.addControl(
			"amountEquivalent",
			new FormControl("amountEquivalent"),
		);

		this.parentForm.form.controls.amount.valueChanges.subscribe((value) =>
			this.onInputToken(value),
		);
		this.parentForm.form.controls.amountEquivalent.valueChanges.subscribe(
			(value) => this.onInputFiat(value),
		);

		this.marketDataProvider.ticker.subscribe((ticker) => {
			this.settingsDataProvider.settings.subscribe((settings) => {
				this.marketCurrency = ticker.getCurrency({
					code: settings.currency,
				});
				this.fiatFractionDigits =
					this.marketCurrency.code === "btc" ? 8 : 3;
			});
		});
	}

	public onInputToken(currency: string | BigNumber) {
		const fiatAmount = new SafeBigNumber(currency).multipliedBy(
			this.marketCurrency.price,
		);
		this.parentForm.form.controls.amountEquivalent.setValue(fiatAmount, {
			emitEvent: false,
		});
	}

	public onInputFiat(currency: string | BigNumber) {
		const tokenAmount = new SafeBigNumber(currency).dividedBy(
			this.marketCurrency.price,
		);
		this.parentForm.form.controls.amount.setValue(tokenAmount, {
			emitEvent: false,
		});
	}
}
