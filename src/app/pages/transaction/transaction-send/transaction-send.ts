import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
	IonRouterOutlet,
	LoadingController,
	ModalController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { TransactionSend, TransactionType } from "ark-ts";
import { PublicKey } from "ark-ts/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { ConfirmTransactionComponent } from "@/components/confirm-transaction/confirm-transaction";
import { InputCurrencyOutput } from "@/components/input-currency/input-currency.component";
import { PinCodeComponent } from "@/components/pin-code/pin-code";
import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { WalletPickerModal } from "@/components/wallet-picker/wallet-picker.modal";
import {
	QRCodeScheme,
	StoredNetwork,
	Wallet,
	WalletKeys,
} from "@/models/model";
import { TranslatableObject } from "@/models/translate";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";
import { AddressCheckResult } from "@/services/address-checker/address-check-result";
import { AddressCheckerProvider } from "@/services/address-checker/address-checker";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { LoggerService } from "@/services/logger/logger.service";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";
import { ArkUtility } from "@/utils/ark-utility";
import { SafeBigNumber } from "@/utils/bignumber";

class CombinedResult {
	public checkerDone: boolean;
	public checkerResult: AddressCheckResult;
	public pinCodeDone: boolean;
	public keys: WalletKeys;

	public constructor(public loader: HTMLIonLoadingElement) {}
}

@Component({
	selector: "page-transaction-send",
	templateUrl: "transaction-send.html",
	styleUrls: ["transaction-send.scss"],
	providers: [TruncateMiddlePipe],
})
export class TransactionSendPage implements OnInit, OnDestroy {
	@ViewChild("pinCode", { read: PinCodeComponent, static: true })
	pinCode: PinCodeComponent;

	@ViewChild("confirmTransaction", {
		read: ConfirmTransactionComponent,
		static: true,
	})
	confirmTransaction: ConfirmTransactionComponent;

	@ViewChild("qrScanner", { read: QRScannerComponent, static: true })
	qrScanner: QRScannerComponent;

	sendForm: FormGroup;

	currentWallet: Wallet;
	currentNetwork: StoredNetwork;
	nodeFees: any;
	fee: number;
	hasFeeError = false;
	hasSent = false;
	sendAllEnabled = false;
	transactionType = TransactionType.SendArk;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		private userDataService: UserDataService,
		private arkApiProvider: ArkApiProvider,
		private toastProvider: ToastProvider,
		private modalCtrl: ModalController,
		private addressChecker: AddressCheckerProvider,
		private loadingCtrl: LoadingController,
		private translateService: TranslateService,
		private ngZone: NgZone,
		private route: ActivatedRoute,
		private routerOutlet: IonRouterOutlet,
		private loggerService: LoggerService,
	) {
		this.currentWallet = this.userDataService.currentWallet;
		this.currentNetwork = this.userDataService.currentNetwork;
	}

	toggleSendAll() {
		this.sendAllEnabled = !this.sendAllEnabled;

		if (this.sendAllEnabled) {
			this.sendAll();
		}
	}

	get vendorFieldLength() {
		return this.currentNetwork.vendorFieldLength || 255;
	}

	sendAll() {
		const balance = Number(this.currentWallet.balance);
		const sendableAmount = balance - this.fee;

		if (sendableAmount <= 0) {
			this.toastProvider.error(
				{
					key: "API.BALANCE_TOO_LOW_DETAIL",
					parameters: {
						token: this.currentNetwork.token,
						fee: ArkUtility.arktoshiToArk(this.fee),
						amount: ArkUtility.arktoshiToArk(balance),
						totalAmount: ArkUtility.arktoshiToArk(
							balance + this.fee,
						),
						balance: ArkUtility.arktoshiToArk(balance),
					},
				} as TranslatableObject,
				10000,
			);
			return;
		}

		const amount = ArkUtility.arktoshiToArk(sendableAmount, true);

		this.sendForm.controls.amount.setValue(amount);
	}

	send() {
		if (!this.validForm()) {
			this.toastProvider.error("TRANSACTIONS_PAGE.INVALID_FORM_ERROR");
		} else if (!this.validAddress()) {
			this.toastProvider.error("TRANSACTIONS_PAGE.INVALID_ADDRESS_ERROR");
		} else {
			this.ngZone.run(() => {
				this.hasSent = true;

				this.translateService
					.get(
						"TRANSACTIONS_PAGE.PERFORMING_DESTINATION_ADDRESS_CHECKS",
					)
					.subscribe(async (translation) => {
						const loader = await this.loadingCtrl.create({
							message: translation,
						});
						const combinedResult: CombinedResult = new CombinedResult(
							loader,
						);
						this.addressChecker
							.checkAddress(
								this.sendForm.get("recipientId").value,
							)
							.subscribe((checkerResult) => {
								combinedResult.checkerDone = true;
								combinedResult.checkerResult = checkerResult;
								this.createTransactionAndShowConfirm(
									combinedResult,
								);
							});
						this.pinCode.open(
							"PIN_CODE.TYPE_PIN_SIGN_TRANSACTION",
							true,
							true,
							(keys: WalletKeys) => {
								combinedResult.pinCodeDone = true;
								combinedResult.keys = keys;
								this.createTransactionAndShowConfirm(
									combinedResult,
								);
							},
						);
					});
			});
		}
	}

	public hasNotSent(): void {
		this.hasSent = false;
	}

	scanQRCode() {
		this.qrScanner.open(true);
	}

	async presetWalletPickerModal() {
		const modal = await this.modalCtrl.create({
			component: WalletPickerModal,
			swipeToClose: true,
			presentingElement: this.routerOutlet.nativeEl,
			mode: "ios",
			cssClass: "c-wallet-picker-modal",
		});

		modal.present();

		modal.onDidDismiss().then(({ data }) => {
			if (data) {
				this.sendForm.patchValue({
					recipientId: data.address,
				});
			}
		});
	}

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address) {
			this.sendForm.controls.recipientId.setValue(qrCode.address);
			const amount = Number(qrCode.amount);
			if (amount) {
				this.sendForm.controls.amount.setValue(amount);
			}
			if (qrCode.vendorField) {
				this.sendForm.controls.vendorField.setValue(qrCode.vendorField);
			}
		} else {
			this.toastProvider.error("QR_CODE.INVALID_QR_ERROR");
		}
	}

	ngOnInit(): void {
		this.arkApiProvider
			.prepareFeesByType(TransactionType.SendArk)
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((data) => {
				this.nodeFees = data;
			});

		this.hasNotSent();

		this.pinCode.close.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
			this.hasNotSent();
		});
		this.confirmTransaction.error
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.hasNotSent();
			});
		this.confirmTransaction.close
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.hasNotSent();
			});

		this.sendForm = new FormGroup({
			recipientId: new FormControl(""),
			amount: new FormControl("", [Validators.required]),
			amountEquivalent: new FormControl(""),
			vendorField: new FormControl(""),
		});

		this.sendForm.controls.recipientId.setValue(
			this.route.snapshot.queryParamMap.get("address") || "",
		);
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	public onFeeChange(output: InputCurrencyOutput) {
		this.fee = output.satoshi.toNumber();

		if (this.sendAllEnabled) {
			this.sendAll();
		}
	}

	public onFeeError(hasError: boolean) {
		this.hasFeeError = hasError;
	}

	private validAddress(): boolean {
		const recipientId = this.sendForm.get("recipientId").value;
		const isValid = PublicKey.validateAddress(
			recipientId,
			this.currentNetwork,
		);

		this.sendForm.controls.recipientId.setErrors({
			incorrect: !isValid,
		});

		return isValid;
	}

	private validForm(): boolean {
		let isValid = true;
		if (
			!this.sendForm.controls.amount.value ||
			this.sendForm.controls.amount.value <= 0 ||
			(this.sendForm.controls.vendorField.value || "").length >
				this.vendorFieldLength
		) {
			isValid = false;
		}

		return isValid;
	}

	private createTransactionAndShowConfirm(result: CombinedResult) {
		if (!result.pinCodeDone) {
			return;
		}

		if (!result.checkerDone) {
			result.loader.present();
			return;
		}

		result.loader.dismiss();
		const amount = this.sendForm.get("amount").value;

		const prepareData = {
			amount: new SafeBigNumber(amount)
				.times(constants.WALLET_UNIT_TO_SATOSHI)
				.toNumber(),
			vendorField: this.sendForm.get("vendorField").value,
			recipientId: this.sendForm.get("recipientId").value,
			fee: this.fee,
		};

		const data: TransactionSend = {
			...prepareData,
			passphrase: result.keys.key,
			secondPassphrase: result.keys.secondKey,
		};

		this.loggerService.info(prepareData);

		this.arkApiProvider.transactionBuilder
			.createTransaction(data)
			.subscribe(
				(transaction) => {
					// The transaction will be signed again;
					this.confirmTransaction.open(
						transaction,
						result.keys,
						result.checkerResult,
					);
				},
				() => {
					this.toastProvider.error(
						"TRANSACTIONS_PAGE.CREATE_TRANSACTION_ERROR",
					);
					this.hasNotSent();
				},
			);
	}
}
