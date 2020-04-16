import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { INTRO_STATE_TOKEN } from "../shared/intro.state";
import { IntroStateModel } from "../shared/intro.type";

@Component({
	selector: "intro-pagination",
	templateUrl: "intro-pagination.component.html",
	styleUrls: ["intro-pagination.component.pcss"],
})
export class IntroPagination implements OnInit {
	@Select(INTRO_STATE_TOKEN)
	public intro$: Observable<IntroStateModel>;
	public pagination: Array<number>;

	constructor(private store: Store) {}

	ngOnInit() {
		this.intro$.subscribe((state) => {
			if (state.paginationSize) {
				this.pagination = new Array(state.paginationSize);
			}
		});
	}
}
