import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoadingController } from "@ionic/angular";

import {
	Contact,
	QRCodeScheme,
	SendTransactionForm,
	StoredNetwork,
	Wallet,
	WalletKeys,
} from "@/models/model";

import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { ContactsProvider } from "@/services/contacts/contacts";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataProvider } from "@/services/user-data/user-data";

import { AccountAutoCompleteService } from "@/services/account-auto-complete/account-auto-complete";

import { PublicKey } from "ark-ts/core";
import { Subject } from "rxjs";

import * as constants from "@/app/app.constants";
import { ConfirmTransactionComponent } from "@/components/confirm-transaction/confirm-transaction";
import { PinCodeComponent } from "@/components/pin-code/pin-code";
import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";
import { TransactionSend, TransactionType } from "ark-ts";

import { AutoCompleteAccount, AutoCompleteAccountType } from "@/models/contact";
import { TranslatableObject } from "@/models/translate";
import { AddressCheckResult } from "@/services/address-checker/address-check-result";
import { AddressCheckerProvider } from "@/services/address-checker/address-checker";
import { ArkUtility } from "@/utils/ark-utility";
import { SafeBigNumber } from "@/utils/bignumber";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AutoCompleteComponent } from "ionic4-auto-complete";
import { takeUntil } from "rxjs/operators";

class CombinedResult {
	public checkerDone: boolean;
	public checkerResult: AddressCheckResult;
	public pinCodeDone: boolean;
	public keys: WalletKeys;

	public constructor(public loader: HTMLIonLoadingElement) {}
}

enum AddressType {
	Unknown,
	Contact,
	WalletWithLabel,
	WalletWithoutLabel,
}

@Component({
	selector: "page-transaction-send",
	templateUrl: "transaction-send.html",
	styleUrls: ["transaction-send.scss"],
	providers: [TruncateMiddlePipe],
})
export class TransactionSendPage implements OnInit, OnDestroy {
	@ViewChild("sendTransactionForm", { static: true })
	sendTransactionHTMLForm: HTMLFormElement;

	@ViewChild("pinCode", { read: PinCodeComponent, static: true })
	pinCode: PinCodeComponent;

	@ViewChild("confirmTransaction", {
		read: ConfirmTransactionComponent,
		static: true,
	})
	confirmTransaction: ConfirmTransactionComponent;

	@ViewChild("qrScanner", { read: QRScannerComponent, static: true })
	qrScanner: QRScannerComponent;

	@ViewChild("searchBar", { read: AutoCompleteComponent, static: true })
	searchBar: AutoCompleteComponent;

	sendForm: FormGroup;
	transaction: SendTransactionForm = {};

	currentWallet: Wallet;
	currentNetwork: StoredNetwork;
	fee: number;
	hasFeeError = false;
	addressType: AddressType = AddressType.Unknown;
	addressTypes = AddressType;
	isRecipientNameAutoSet: boolean;
	hasSent = false;
	sendAllEnabled = false;
	transactionType = TransactionType.SendArk;

	private currentAutoCompleteFieldValue: string;
	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		private userDataProvider: UserDataProvider,
		private contactsProvider: ContactsProvider,
		private arkApiProvider: ArkApiProvider,
		private toastProvider: ToastProvider,
		public contactsAutoCompleteService: AccountAutoCompleteService,
		private truncateMiddlePipe: TruncateMiddlePipe,
		private addressChecker: AddressCheckerProvider,
		private loadingCtrl: LoadingController,
		private translateService: TranslateService,
		private ngZone: NgZone,
		private route: ActivatedRoute,
	) {
		this.currentWallet = this.userDataProvider.currentWallet;
		this.currentNetwork = this.userDataProvider.currentNetwork;
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

		this.transaction.amount = ArkUtility.arktoshiToArk(
			sendableAmount,
			true,
		);

		this.sendForm.controls.amount.setValue(this.transaction.amount);
	}

	send() {
		if (!this.validForm()) {
			this.toastProvider.error("TRANSACTIONS_PAGE.INVALID_FORM_ERROR");
		} else if (!this.validAddress()) {
			this.toastProvider.error("TRANSACTIONS_PAGE.INVALID_ADDRESS_ERROR");
		} else {
			this.ngZone.run(() => {
				this.hasSent = true;
				this.createContactOrLabel();

				this.translateService
					.get(
						"TRANSACTIONS_PAGE.PERFORMING_DESTINATION_ADDRESS_CHECKS",
					)
					.subscribe(async translation => {
						const loader = await this.loadingCtrl.create({
							message: translation,
						});
						const combinedResult: CombinedResult = new CombinedResult(
							loader,
						);
						this.addressChecker
							.checkAddress(this.transaction.recipientAddress)
							.subscribe(checkerResult => {
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

	public onSearchItem(account: AutoCompleteAccount): void {
		if (!account || !account.address) {
			return;
		}

		this.transaction.recipientAddress = account.address;
		this.currentAutoCompleteFieldValue = account.name;
		this.isRecipientNameAutoSet = true;

		if (account.name !== account.address) {
			this.addressType =
				account.type === AutoCompleteAccountType.Wallet
					? AddressType.WalletWithLabel
					: AddressType.Contact;
			this.transaction.recipientName = account.name;
		} else {
			this.addressType =
				account.type === AutoCompleteAccountType.Wallet
					? AddressType.WalletWithoutLabel
					: AddressType.Unknown;
			this.transaction.recipientName = null;
		}
	}

	public onSearchInput(input: string): void {
		// this check is needed because clicking into the field, also triggers this method
		// and then the recipientName is set to null, even though nothing has changed
		if (input === this.currentAutoCompleteFieldValue) {
			return;
		}

		this.setRecipientByAddress(input);
	}

	public onSearchPaste(input: ClipboardEvent) {
		this.setFormValuesFromAddress(input.clipboardData.getData("text"));
	}

	public showFullAddress(): void {
		// When field has focus, show full address
		this.searchBar.setValue(this.transaction.recipientAddress);
	}

	public onSearchBlur(input: CustomEvent): void {
		this.truncateAddressMiddle();
	}

	public truncateAddressMiddle(): void {
		// When field loses focus, use ellipses to show beginning and end of address
		const addressString = this.transaction.recipientAddress;
		setTimeout(() => {
			this.searchBar.setValue(
				this.truncateMiddlePipe.transform(
					addressString,
					constants.TRANSACTION_ADDRESS_SIZE,
					addressString,
				),
			);
		}, 0);
	}

	private validAddress(): boolean {
		const isValid = PublicKey.validateAddress(
			this.transaction.recipientAddress,
			this.currentNetwork,
		);

		this.sendTransactionHTMLForm.form.controls.recipientAddress.setErrors({
			incorrect: !isValid,
		});

		return isValid;
	}

	private validForm(): boolean {
		let isValid = true;
		if (
			!this.sendTransactionHTMLForm.form.controls.amount.value ||
			this.sendTransactionHTMLForm.form.controls.amount.value <= 0 ||
			(this.sendTransactionHTMLForm.form.controls.smartBridge.value || "")
				.length > this.vendorFieldLength
		) {
			isValid = false;
		}

		return isValid;
	}

	createContactOrLabel() {
		if (
			this.addressType === AddressType.Contact ||
			this.addressType === AddressType.WalletWithLabel ||
			!this.transaction.recipientName
		) {
			return;
		}

		const validAddress = this.validAddress();
		const validName = new RegExp("^[a-zA-Z0-9]+[a-zA-Z0-9- ]+$").test(
			this.transaction.recipientName,
		);

		if (validAddress && validName) {
			if (this.addressType === AddressType.Unknown) {
				this.contactsProvider
					.addContact(
						this.transaction.recipientAddress,
						this.transaction.recipientName,
					)
					.subscribe();
			} else {
				this.userDataProvider
					.setWalletLabel(
						this.userDataProvider.getWalletByAddress(
							this.transaction.recipientAddress,
						),
						this.transaction.recipientName,
					)
					.subscribe();
			}
		}
	}

	scanQRCode() {
		this.qrScanner.open(true);
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
		const data: TransactionSend = {
			amount: new SafeBigNumber(amount)
				.times(constants.WALLET_UNIT_TO_SATOSHI)
				.toNumber(),
			vendorField: this.transaction.smartBridge,
			passphrase: result.keys.key,
			secondPassphrase: result.keys.secondKey,
			recipientId: this.transaction.recipientAddress,
			fee: this.fee,
		};

		this.arkApiProvider.transactionBuilder
			.createTransaction(data)
			.subscribe(
				transaction => {
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

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address) {
			this.setFormValuesFromAddress(qrCode.address, qrCode.label);
			const amount = Number(qrCode.amount);
			if (!!amount) {
				this.sendForm.controls.amount.setValue(amount);
			}
			if (qrCode.vendorField) {
				this.transaction.smartBridge = qrCode.vendorField;
			}
		} else {
			this.toastProvider.error("QR_CODE.INVALID_QR_ERROR");
		}
	}

	ngOnInit(): void {
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
			recipientAddress: new FormControl(""),
			recipientName: new FormControl(""),
			amount: new FormControl("", [Validators.required]),
			amountEquivalent: new FormControl(""),
			smartBridge: new FormControl(""),
		});

		this.setFormValuesFromAddress(
			this.route.snapshot.queryParamMap.get("address") || "",
		);
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	public onFeeChange(newFee: number) {
		this.fee = newFee;

		if (this.sendAllEnabled) {
			this.sendAll();
		}
	}

	public onFeeError(hasError: boolean) {
		this.hasFeeError = hasError;
	}

	private setFormValuesFromAddress(
		address: string,
		alternativeRecipientName?: string,
	): void {
		if (!address) {
			return;
		}

		this.sendForm.patchValue({ recipientAddress: address });
		this.setRecipientByAddress(address, alternativeRecipientName);
		this.truncateAddressMiddle();
	}

	private setRecipientByAddress(
		input: string,
		alternativeRecipientName?: string,
	): void {
		if (input.indexOf("...") !== -1) {
			return;
		}

		this.currentAutoCompleteFieldValue = input;
		this.transaction.recipientAddress = input;

		const contact: Contact = this.contactsProvider.getContactByAddress(
			input,
		);
		if (contact) {
			this.addressType = AddressType.Contact;
			this.isRecipientNameAutoSet = true;
			this.transaction.recipientName = contact.name;
			return;
		}

		const walletLabel = this.userDataProvider.getWalletLabel(input);
		if (walletLabel) {
			this.addressType = AddressType.WalletWithLabel;
			this.isRecipientNameAutoSet = true;
			this.transaction.recipientName = walletLabel;
			return;
		}

		this.addressType = this.userDataProvider.getWalletByAddress(input)
			? AddressType.WalletWithoutLabel
			: AddressType.Unknown;

		if (alternativeRecipientName) {
			this.isRecipientNameAutoSet = true;
			this.transaction.recipientName = alternativeRecipientName;
		} else if (this.isRecipientNameAutoSet) {
			this.transaction.recipientName = null;
		}
	}
}
