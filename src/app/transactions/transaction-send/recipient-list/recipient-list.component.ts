import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "recipient-list",
	templateUrl: "recipient-list.component.html",
	styleUrls: ["recipient-list.component.scss"],
})
export class RecipientListComponent implements OnInit {
	@Input()
	recipients: Array<{ address: string; amount: string }> = [];

	public recipientList: Array<{ address: string; amount: string }> = [];

	ngOnInit(): void {
		this.recipientList = this.recipients;
	}

	public removeRecipient(address: string) {
		return (this.recipientList = this.recipientList.filter(
			({ address: existentAddress }) => existentAddress !== address,
		));
	}
}
