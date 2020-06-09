import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AddressValidator } from "@/app/validators/address/address";

@Component({
	selector: "transaction-send",
	templateUrl: "transaction-send.component.html",
	styleUrls: ["transaction-send.component.scss"],
	providers: [AddressValidator],
})
export class TransactionSendComponent implements OnInit {
	@Input()
	public balance: string;

	@Input()
	public currency: string;

	public recipients: any = [];

	public isRecipientListOpen: boolean = false;
	public isBackdropEnabled: boolean = false;

	transactionForm: FormGroup;

	constructor(private addressValidator: AddressValidator) {}

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
}
