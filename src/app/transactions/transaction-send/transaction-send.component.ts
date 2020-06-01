import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AddressValidator } from "@/app/validators/address/address";
import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { QRCodeScheme } from "@/models/model";
import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "transaction-send",
	templateUrl: "transaction-send.component.html",
	styleUrls: ["transaction-send.component.scss"],
	providers: [AddressValidator],
})
export class TransactionSendComponent implements OnInit {
	@ViewChild(QRScannerComponent)
	qrScanner: QRScannerComponent;

	@Input()
	public balance: string;

	public recipients: any = [];

	public isRecipientListOpen: boolean = false;
	public isBackdropEnabled: boolean = false;

	transactionForm: FormGroup;

	constructor(
		private toastProvider: ToastProvider,
		private addressValidator: AddressValidator,
	) {}

	ngOnInit(): void {
		this.transactionForm = new FormGroup({
			amount: new FormControl("", [Validators.required]),
			address: new FormControl("", [
				Validators.required,
				this.addressValidator.isValid.bind(this.addressValidator),
			]),
		});
	}

	toggleBottomDrawer() {
		if (this.recipients.length) {
			this.isRecipientListOpen = !this.isRecipientListOpen;
			this.isBackdropEnabled = !this.isBackdropEnabled;
		}
	}

	addRecipient() {
		const { address, amount } = this.transactionForm.value;

		this.recipients.push({ address, amount });

		console.log(this.transactionForm.value);
	}

	deleteRecipient(recipientAddress) {
		return (this.recipients = this.recipients.filter(
			({ address }) => address !== recipientAddress,
		));
	}

	createTransaction() {
		const transaction = this.recipients.reduce(
			(acc, item) => {
				acc.totalAmount = acc.totalAmount += item.amount;
				acc.recipients = [...acc.recipients, item.address];

				return acc;
			},
			{
				totalAmount: 0,
				recipients: [],
			},
		);

		console.log({ transaction });
		return transaction;
	}

	scanQRCode() {
		this.qrScanner.open(true);
	}

	onScanQRCode(qrCode: QRCodeScheme) {
		if (qrCode.address) {
			this.transactionForm.get("address").setValue(qrCode.address);
			if (qrCode.amount) {
				this.transactionForm.get("amount").setValue(qrCode.amount);
			}
		} else {
			this.toastProvider.error("QR_CODE.INVALID_QR_ERROR");
		}
	}
}
