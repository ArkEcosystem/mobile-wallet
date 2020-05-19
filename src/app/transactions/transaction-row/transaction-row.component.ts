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

	public truncate(str) {
		const separator = "...";
		const max = 14;
		const separatorLength = separator.length;

		const shift = -0.5 * (max - length - separatorLength);
		const center = length / 2;

		return (
			str.substr(0, center - shift) +
			separator +
			str.substr(length - center + shift)
		);
	}

	public getTransactionTime(timestamp: string) {
		const date = new Date(parseInt(timestamp) * 1000);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		return `${hours}:${minutes}:${seconds}`;
	}

	public getTransactionLabel(type: string) {
		return type === "sent" ? "Sent to" : "From";
	}

	public openTransactionDetailsHandler(id: string) {
		this.openTransactionDetails.emit(id);
	}
}
