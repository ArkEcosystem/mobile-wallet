import { Component, Input, OnInit } from "@angular/core";
import dayjs from "dayjs";
import { groupBy } from "lodash";

// import { Transaction } from "@/models/model";

@Component({
	selector: "transaction-list",
	templateUrl: "transaction-list.component.html",
	styleUrls: ["transaction-list.component.scss"],
})
export class TransactionListComponent implements OnInit {
	@Input()
	public transactions: [] = [];

	@Input()
	public expanded: boolean = false;

	public dates: string[];
	public transactionsList;

	constructor() {}

	ngOnInit(): void {
		const groupedByDateTransactions = groupBy(
			this.transactions,
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
