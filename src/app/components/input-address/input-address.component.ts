import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import {
	ControlContainer,
	FormControl,
	FormGroupDirective,
} from "@angular/forms";
import { IonInput } from "@ionic/angular";

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
export class InputAddressComponent implements OnInit, AfterViewInit {
	@ViewChild(IonInput)
	public input: IonInput;

	@Output()
	public inputAddressQRCodeClick = new EventEmitter();

	@Output()
	public inputAddressContactClick = new EventEmitter();

	@Input()
	public address: string;

	public formControl: FormControl;
	public displayAddress: string;

	constructor(
		private parentForm: FormGroupDirective,
		private truncateMiddlePipe: TruncateMiddlePipe,
	) {}

	public ngOnInit() {
		this.formControl = new FormControl();
		this.formControl.valueChanges.subscribe(value => {
			this.displayAddress = this.truncateMiddlePipe.transform(value, 15);
		});
		this.parentForm.form?.addControl("recipientId", this.formControl);
	}

	public onPaste(input: ClipboardEvent) {
		const value = input.clipboardData.getData("text");
		this.formControl.setValue(value);
	}

	async ngAfterViewInit() {
		if (this.address) {
			this.formControl.setValue(this.address);
			// Workaround to truncate the address
			const inputEl = await this.input.getInputElement();
			inputEl.focus();
			inputEl.blur();
		}
	}

	public emitContactClick() {
		this.inputAddressContactClick.emit();
	}

	public emitQRCodeClick() {
		this.inputAddressQRCodeClick.emit();
	}
}
