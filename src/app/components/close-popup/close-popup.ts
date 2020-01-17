import {
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
} from "@angular/core";

@Component({
	selector: "close-popup",
	templateUrl: "close-popup.html",
	styleUrls: ["close-popup.scss"],
})
export class ClosePopupComponent {
	@HostBinding("style.z-index")
	style = 1000;

	@Input()
	large: boolean;

	@Input()
	color: string;

	@Output()
	close: EventEmitter<void> = new EventEmitter();

	constructor() {}

	onClose() {
		this.close.emit();
	}
}
