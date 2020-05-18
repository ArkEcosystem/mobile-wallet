import { Component } from "@angular/core";
import { groupBy } from "lodash";
import moment from "moment";

import { newTransactions } from "@@/test/fixture/transactions.fixture";
// import { Transaction } from "@/models/model";

@Component({
	selector: "transaction-list",
	templateUrl: "transaction-list.component.html",
	styleUrls: ["transaction-list.component.scss"],
})
export class TransactionListComponent {
	// @Input()
	// transactions: Transaction[] = [];

	public dates: string[];
	public transactionsList;

	constructor() {
		const groupedByDateTransactions = this.groupTransactionsByDate(
			newTransactions,
		);

		// console.log({ groupedByDateTransactions });
		this.dates = Object.keys(groupedByDateTransactions);
		this.transactionsList = groupedByDateTransactions;
	}

	public groupTransactionsByDate(transactions) {
		return groupBy(transactions, (transaction) =>
			moment(transaction["timestamp"]["unix"] * 1000).format(
				"MM/DD/YYYY",
			),
		);
	}

	public renderTransactions(date) {
		return this.transactionsList[date];
	}

	public getDate(date) {
		return moment(date).format("DD MMMM");
	}

	public getWeekDay(date) {
		return moment(date).format("dddd");
	}
}
