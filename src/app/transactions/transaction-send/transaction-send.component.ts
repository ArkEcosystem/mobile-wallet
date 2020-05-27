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

	public recipients: [] = [];

	transactionForm: FormGroup;

	constructor() {
		this.transactionForm = new FormGroup({
			address: new FormControl("", [Validators.required]),
			amount: new FormControl("", [Validators.required]),
		});
	}

	debugForm() {
		console.log(this.transactionForm.value);
	}
}
