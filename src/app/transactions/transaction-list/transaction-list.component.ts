import { Component, OnInit } from "@angular/core";
import dayjs from "dayjs";
import { groupBy } from "lodash";

import { newTransactions } from "@@/test/fixture/transactions.fixture";
// import { Transaction } from "@/models/model";

@Component({
	selector: "transaction-list",
	templateUrl: "transaction-list.component.html",
	styleUrls: ["transaction-list.component.scss"],
})
export class TransactionListComponent implements OnInit {
	// @Input()
	// transactions: Transaction[] = [];

	public dates: string[];
	public transactionsList;

	constructor() {}

	ngOnInit(): void {
		const groupedByDateTransactions = groupBy(
			newTransactions,
			(transaction) =>
				dayjs(transaction["timestamp"]["unix"] * 1000).format(
					"MM/DD/YYYY",
				),
		);
		const dateKeys = Object.keys(groupedByDateTransactions);

		this.transactionsList = groupedByDateTransactions;
		this.dates = Object.keys(groupedByDateTransactions);
	}
}
