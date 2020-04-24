import { Component, Input, OnInit } from "@angular/core";

import { Transaction, TransactionOperation } from "../shared/transaction.types";

@Component({
	selector: "transaction-detail",
	templateUrl: "transaction-detail.component.html",
	styleUrls: ["transaction-detail.component.pcss"],
})
export class TransactionDetailComponent implements OnInit {
	@Input()
	public transaction: TransactionOperation | Transaction;

	@Input()
	public token: string;

	constructor() {}

	ngOnInit() {}
}
