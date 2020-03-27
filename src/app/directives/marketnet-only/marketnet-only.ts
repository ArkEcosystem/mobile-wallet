import { Directive, ElementRef, OnInit } from "@angular/core";

import { UserDataService } from "@/services/user-data/user-data.interface";

@Directive({
	selector: "[appMarketNetOnly]",
})
export class MarketNetOnlyDirective implements OnInit {
	constructor(
		private userDataService: UserDataService,
		private elementRef: ElementRef,
	) {}

	ngOnInit() {
		if (
			!this.userDataService.currentNetwork.marketTickerName &&
			!this.userDataService.isMainNet
		) {
			this.elementRef.nativeElement.style.display = "none";
		}
	}
}
