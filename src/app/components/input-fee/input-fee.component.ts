import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { TransactionType } from "ark-ts";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

import { FeeStatistic } from "@/models/stored-network";
import { ArkApiProvider } from "@/services/ark-api/ark-api";

import { ArkUtility } from "../../utils/ark-utility";

@Component({
	selector: "input-fee",
	templateUrl: "input-fee.component.html",
	styleUrls: ["input-fee.component.scss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputFeeComponent implements OnInit, OnDestroy {
	@Input()
	public transactionType: number;

	@Output()
	public change: EventEmitter<number> = new EventEmitter();

	@Output()
	public error: EventEmitter<boolean> = new EventEmitter();

	public step: number;
	public v1Fee: number;
	public v2Fee: FeeStatistic;
	public rangeFee: number;
	public min: number;
	public max: number;
	public avg: number;
	public symbol: string;
	public isStaticFee = false;
	public warningMessage: string;
	public errorMessage: string;
	public limitFee: number;
	public subscription: Subscription;

	constructor(
		private arkApiProvider: ArkApiProvider,
		private translateService: TranslateService,
		private parentForm: FormGroupDirective,
	) {
		this.step = 1;
		this.min = this.step;
		this.symbol = this.arkApiProvider.network.symbol;
	}

	ngOnInit() {
		this.parentForm.form.addControl("fee", new FormControl("fee"));
		this.parentForm.form.addControl(
			"feeRange",
			new FormControl("feeRange"),
		);
		this.parentForm.form.controls.fee.valueChanges.subscribe(value =>
			this.onInputText(value),
		);
		this.parentForm.form.controls.feeRange.valueChanges.subscribe(value =>
			this.onInputRange(value),
		);
		this.prepareFeeStatistics();
	}

	public get maxArktoshi() {
		return ArkUtility.subToUnit(this.max);
	}

	public prepareFeeStatistics() {
		this.subscription = this.arkApiProvider.fees
			.pipe(
				switchMap(fees => {
					switch (Number(this.transactionType)) {
						case TransactionType.SendArk:
							this.v1Fee = fees.send;
							break;
						case TransactionType.Vote:
							this.v1Fee = fees.vote;
							break;
						case TransactionType.CreateDelegate:
							this.v1Fee = fees.delegate;
							break;
					}

					this.max = this.v1Fee;
					this.avg = this.v1Fee;
					this.limitFee = this.max * 10;
					this.setRangeFee(this.avg);

					return this.arkApiProvider.feeStatistics;
				}),
			)
			.subscribe(fees => {
				this.v2Fee = fees.find(
					fee => fee.type === Number(this.transactionType),
				);
				if (!this.v2Fee || this.v2Fee.fees.avgFee > this.max) {
					this.isStaticFee = true;
					return;
				}
				if (this.v2Fee.fees.maxFee > this.max) {
					this.max = this.v2Fee.fees.maxFee;
				}
				this.avg = this.v2Fee.fees.avgFee;
				this.setRangeFee(this.avg);
			});
	}

	public setRangeFee(value: number) {
		this.parentForm.form.controls.feeRange.setValue(value);
		this.emitChange();
	}

	public onInputRange(rangeFee?: number) {
		this.rangeFee = rangeFee;
		const fee = ArkUtility.subToUnit(rangeFee);

		this.parentForm.form.controls.fee.setValue(fee, {
			emitEvent: false,
		});

		const translateParams = {
			symbol: this.symbol,
			fee: ArkUtility.subToUnit(this.limitFee),
		};

		this.translateService
			.get(
				[
					"INPUT_FEE.ERROR.MORE_THAN_MAXIMUM",
					"INPUT_FEE.LOW_FEE_NOTICE",
					"INPUT_FEE.ADVANCED_NOTICE",
				],
				translateParams,
			)
			.subscribe(translation => {
				this.errorMessage = null;
				this.warningMessage = null;

				if (this.avg > rangeFee) {
					this.warningMessage =
						translation["INPUT_FEE.LOW_FEE_NOTICE"];
				} else if (rangeFee > this.limitFee) {
					this.errorMessage =
						translation["INPUT_FEE.ERROR.MORE_THAN_MAXIMUM"];
				} else if (rangeFee > this.max) {
					this.warningMessage =
						translation["INPUT_FEE.ADVANCED_NOTICE"];
				}
				this.error.next(!!this.errorMessage || !fee.length);
			});
	}

	public onInputText(fee?: string) {
		const arktoshi = parseInt(ArkUtility.unitToSub(fee));

		this.parentForm.form.controls.feeRange.setValue(arktoshi, {
			emitEvent: false,
		});

		this.emitChange();
	}

	public emitChange() {
		const rangeFee = this.parentForm.form.get("feeRange");
		this.change.next(rangeFee.value);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
