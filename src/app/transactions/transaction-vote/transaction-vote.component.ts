import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";

import { Delegate } from "@/app/delegates/shared/delegate.types";
import { InputCurrencyOutput } from "@/components/input-currency/input-currency.component";

import { TransactionFormActions } from "../shared/transaction-form/transaction-form.actions";
import {
	TransactionGroup,
	TransactionTypeCore,
} from "../shared/transaction.types";
import { TransactionVoteType } from "./shared/transaction-vote.types";

@Component({
	selector: "transaction-vote",
	templateUrl: "transaction-vote.component.html",
})
export class TransactionVoteComponent implements OnInit, AfterViewInit {
	@Input()
	public delegate: Delegate;

	@Input()
	public voteType: TransactionVoteType;

	@Output()
	public transactionVoteClick = new EventEmitter();

	public formGroup: FormGroup;

	constructor(private store: Store) {}

	ngOnInit() {
		this.formGroup = new FormGroup({
			fee: new FormControl(undefined, [
				Validators.required,
				Validators.min(1),
			]),
			delegate: new FormControl(this.delegate, [Validators.required]),
		});
	}

	ngAfterViewInit() {
		this.startState();
	}

	public handleVote(): void {
		const fee = this.formGroup.get("fee").value;
		this.store.dispatch(
			new TransactionFormActions.Update({
				fee,
				asset: {
					votes: [`${this.voteType}${this.delegate.username}`],
				},
			}),
		);
		this.transactionVoteClick.emit();
	}

	public handleFeeUpdate(output: InputCurrencyOutput): void {
		this.formGroup.patchValue({ fee: output.satoshi.toString() });
	}

	private startState(): void {
		this.store.dispatch(
			new TransactionFormActions.Start({
				type: TransactionTypeCore.VOTE,
				typeGroup: TransactionGroup.CORE,
			}),
		);
	}
}
