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
	FormGroup,
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

	@Input()
	public parent = new FormGroup({});

	@Output()
	public inputAddressQRCodeClick = new EventEmitter();

	@Output()
	public inputAddressContactClick = new EventEmitter();

	@Input()
	public address: string;

	public inputControl = new FormControl();
	public displayAddress: string;

	constructor(private truncateMiddlePipe: TruncateMiddlePipe) {}

	public ngOnInit() {
		this.parent.addControl("recipientId", this.inputControl);
		this.parent.get("recipientId").valueChanges.subscribe(value => {
			this.displayAddress = this.truncateMiddlePipe.transform(value, 15);
		});
	}

	public onPaste(input: ClipboardEvent) {
		const value = input.clipboardData.getData("text");
		this.inputControl.setValue(value);
	}

	async ngAfterViewInit() {
		if (this.address) {
			this.inputControl.setValue(this.address);
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
