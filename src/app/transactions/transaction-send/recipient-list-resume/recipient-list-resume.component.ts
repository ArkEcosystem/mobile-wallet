import { Component, Input } from "@angular/core";

@Component({
	selector: "recipient-list-resume",
	templateUrl: "recipient-list-resume.component.html",
	styleUrls: ["recipient-list-resume.component.scss"],
})
export class RecipientListResumeComponent {
	@Input()
	public recipients: [] = [];

	@Input()
	public recipientsCount: string;

	constructor() {}
}
