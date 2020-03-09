import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";

import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

@Component({
	selector: "input-address",
	templateUrl: "input-address.component.html",
	styleUrls: ["input-address.component.scss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputAddressComponent implements OnInit {
	@Output()
	public inputAddressQRCodeClick = new EventEmitter();

	@Output()
	public inputAddressContactClick = new EventEmitter();

	public displayAddress: string;

	constructor(
		private parentForm: FormGroupDirective,
		private truncateMiddlePipe: TruncateMiddlePipe,
	) {}

	public ngOnInit() {
		this.parentForm.form.addControl("recipientId", new FormControl());
		this.parentForm.form.controls.recipientId.valueChanges.subscribe(
			value => {
				this.displayAddress = this.truncateMiddlePipe.transform(
					value,
					15,
				);
			},
		);
	}

	public onPaste(input: ClipboardEvent) {
		const value = input.clipboardData.getData("text");
		this.parentForm.form.patchValue({
			recipientAddress: value,
		});
	}

	public emitContactClick() {
		this.inputAddressContactClick.emit();
	}

	public emitQRCodeClick() {
		this.inputAddressQRCodeClick.emit();
	}
}
