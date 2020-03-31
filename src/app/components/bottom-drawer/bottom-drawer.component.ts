import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from "@angular/core";
import { CupertinoPane } from "cupertino-pane";

import { BottomDrawerBreak } from "./bottom-drawer.type";

@Component({
	selector: "bottom-drawer",
	template: `<div class="c-bottom-drawer"><ng-content></ng-content></div>`,
})
export class BottomDrawerComponent implements OnChanges, OnDestroy {
	@Input()
	public initialBreak: BottomDrawerBreak = "middle";

	@Input()
	public bottomClose = false;

	@Input()
	public buttonClose = true;

	@Input()
	public isOpen = false;

	@Input()
	public bottomOffset = 100;

	@Input()
	public middleOffset = 300;

	@Input()
	public topOffset = 0;

	@Output()
	public buttonDrawerOnClose = new EventEmitter();

	public pane: CupertinoPane | undefined;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		this.render();
		if (!changes.isOpen.currentValue) {
			this.pane?.hide();
		} else {
			this.pane?.moveToBreak(this.initialBreak);
		}
	}

	ngOnDestroy() {
		this.pane?.destroy();
	}

	private render() {
		const breaks = {
			bottom: {
				enabled: !!this.bottomOffset,
				offset: this.bottomOffset,
			},
			middle: {
				enabled: !!this.middleOffset,
				offset: this.middleOffset,
			},
		};

		if (this.topOffset) {
			breaks["top"] = {
				enabled: true,
				offset: this.topOffset,
			};
		}
		if (!this.pane) {
			this.pane = new CupertinoPane(".c-bottom-drawer", {
				parentElement: "body",
				initialBreak: this.initialBreak,
				breaks,
				onDidDismiss: () => {
					this.pane = undefined;
					this.buttonDrawerOnClose.emit();
				},
			});
			this.pane.present();
		}
	}
}
