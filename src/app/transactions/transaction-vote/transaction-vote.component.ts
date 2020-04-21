import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { VoteType } from "ark-ts";

import { Delegate } from "@/app/delegates/shared/delegate.types";
import { SatoshiAmount } from "@/app/shared/shared.types";
import { InputCurrencyOutput } from "@/components/input-currency/input-currency.component";

@Component({
	selector: "transaction-vote",
	templateUrl: "transaction-vote.component.html",
})
export class TransactionVoteComponent implements OnInit {
	@Input()
	public delegate: Delegate;

	@Input()
	public type: VoteType;

	@Output()
	public transactionVoteClick = new EventEmitter<{
		delegate: Delegate;
		fee: SatoshiAmount;
	}>();

	public formGroup: FormGroup;

	constructor() {}

	ngOnInit() {
		this.formGroup = new FormGroup({
			fee: new FormControl(undefined, [
				Validators.required,
				Validators.min(1),
			]),
			delegate: new FormControl(this.delegate, [Validators.required]),
		});
	}

	public handleVote() {
		this.transactionVoteClick.emit({
			delegate: this.delegate,
			fee: this.formGroup.get("fee").value,
		});
	}

	public handleFeeUpdate(output: InputCurrencyOutput) {
		this.formGroup.patchValue({ fee: output.satoshi.toString() });
	}
}
