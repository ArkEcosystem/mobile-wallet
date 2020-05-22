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

	public editing: string[] = [];

	ngOnInit(): void {
		this.recipientList = this.recipients;
	}

	public removeRecipient(address: string) {
		return (this.recipientList = this.recipientList.filter(
			({ address: existentAddress }) => existentAddress !== address,
		));
	}

	public editRecipient(address: string) {
		return this.editing.push(address);
	}

	public isEditing(recipientAddress: string) {
		return this.editing.find((address) => address === recipientAddress);
	}
}
