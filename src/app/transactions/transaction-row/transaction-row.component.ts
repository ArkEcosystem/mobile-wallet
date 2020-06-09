import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "transaction-row",
	templateUrl: "transaction-row.component.html",
	styleUrls: ["transaction-row.component.scss"],
})
export class TransactionRowComponent {
	@Input()
	transaction: any;

	@Output()
	openTransactionDetails = new EventEmitter();

	constructor() {}

	public openTransactionDetailsHandler(id: string) {
		this.openTransactionDetails.emit(id);
	}
}
