import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "recipient-list",
	templateUrl: "recipient-list.component.html",
	styleUrls: ["recipient-list.component.scss"],
})
export class RecipientListComponent {
	@Input()
	recipients: Array<{ address: string; amount: string }> = [];

	@Output()
	public onDelete = new EventEmitter();

	public removeRecipient(address: string) {
		return this.onDelete.emit(address);
	}
}
