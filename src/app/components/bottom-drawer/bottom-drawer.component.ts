import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	Renderer2,
	SimpleChanges,
} from "@angular/core";
import { CupertinoPane } from "cupertino-pane";

@Component({
	selector: "bottom-drawer",
	template: `<div class="c-bottom-drawer"><ng-content></ng-content></div>`,
	styles: [
		`
			:host {
				display: none;
			}
		`,
	],
})
export class BottomDrawerComponent implements OnChanges, OnDestroy {
	@Input()
	public initialBreak: "top" | "middle" | "bottom" = "middle";

	@Input()
	public parentElement = "body";

	@Input()
	public bottomClose = true;

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

	@Input()
	public backdrop = true;

	@Output()
	public buttonDrawerOnClose = new EventEmitter();

	@Output()
	public buttonDrawerOnBackdropTap = new EventEmitter();

	public pane: CupertinoPane | undefined;
	public isPresent = false;

	constructor(private renderer: Renderer2) {}

	ngOnChanges(changes: SimpleChanges) {
		this.render();
		if (!changes.isOpen.currentValue) {
			if (this.isPresent) {
				this.pane?.destroy({ animate: true });
			}
		} else {
			this.pane?.present({ animate: true });
		}
	}

	ngOnDestroy() {
		try {
			this.pane?.destroy();
			this.hide();
		} catch {}
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
				parentElement: this.parentElement,
				initialBreak: this.initialBreak,
				breaks,
				backdrop: this.backdrop,
				bottomClose: this.bottomClose,
				buttonClose: this.buttonClose,
				onWillDismiss: () => this.hide(),
				onDidDismiss: () => this.buttonDrawerOnClose.emit(),
				onWillPresent: () => this.show(),
				onBackdropTap: () => this.buttonDrawerOnBackdropTap.emit(),
			});
		}
	}

	private hide() {
		this.pane = undefined;
		this.isPresent = false;
		if (this.backdrop) {
			this.renderer.removeClass(
				document.querySelector("body"),
				"o-overlay--open",
			);
		}
	}

	private show() {
		this.isPresent = true;
		if (this.backdrop) {
			this.renderer.addClass(
				document.querySelector("body"),
				"o-overlay--open",
			);
		}
	}
}
