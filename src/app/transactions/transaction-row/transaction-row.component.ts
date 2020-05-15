import { Component, Input } from "@angular/core";

import { Transaction } from "@/models/model";

@Component({
	selector: "transaction-row",
	templateUrl: "transaction-row.component.html",
	styleUrls: ["transaction-row.component.scss"],
})
export class TransactionRowComponent {
	@Input()
	transaction: Transaction;

	constructor() {}

	public truncate(str, max, separator) {
		max = max || 14;
		const length = str.length;
		if (length > max) {
			separator = separator || "...";
			const separatorLengh = separator.length;
			if (separatorLengh > max) {
				return str.substr(length - max);
			}

			const shift = -0.5 * (max - length - separatorLengh);
			const center = length / 2;
			return (
				str.substr(0, center - shift) +
				separator +
				str.substr(length - center + shift)
			);
		}
		return str;
	}

	public getTransactionTime(timestamp: string) {
		console.log({ timestamp });
		const date = new Date(parseInt(timestamp) * 1000);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		return `${hours}:${minutes}:${seconds}`;
	}

	public getTransactionLabel(type: string) {
		return type === "sent" ? "Sent to" : "From";
	}
}
