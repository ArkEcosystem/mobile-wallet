import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "recipient-list-resume",
	templateUrl: "recipient-list-resume.component.html",
	styleUrls: ["recipient-list-resume.component.scss"],
})
export class RecipientListResumeComponent implements OnInit {
	@Input()
	public recipients: [];

	@Input()
	public recipientsCount: string;

	public recipientList: any;

	constructor() {}

	ngOnInit(): void {
		this.recipientList =
			this.recipients?.length > 3
				? this.recipients.slice(0, 3)
				: this.recipients;
	}
}
