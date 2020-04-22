import { Component, Input, OnInit } from "@angular/core";

import { TransactionFormModel } from "../shared/transaction.types";

@Component({
	selector: "transaction-detail",
	templateUrl: "transaction-detail.component.html",
})
export class TransactionDetailComponent implements OnInit {
	@Input()
	public transaction: TransactionFormModel;

	constructor() {}

	ngOnInit() {}
}
