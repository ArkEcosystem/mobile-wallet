import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "transaction-send",
	templateUrl: "transaction-send.component.html",
	styleUrls: ["transaction-send.component.scss"],
})
export class TransactionSendComponent {
	@Input()
	public balance: string;

	public recipients: any = [];

	public isRecipientListOpen: boolean = false;
	public isBackdropEnabled: boolean = false;

	transactionForm: FormGroup;

	constructor() {
		this.transactionForm = new FormGroup({
			address: new FormControl("", [Validators.required]),
			amount: new FormControl("", [Validators.required]),
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
