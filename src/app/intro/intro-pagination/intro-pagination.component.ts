import { Component, Input } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { INTRO_STATE_TOKEN } from "../shared/intro.state";
import { IntroStateModel } from "../shared/intro.type";

@Component({
	selector: "intro-pagination",
	templateUrl: "intro-pagination.component.html",
	styleUrls: ["intro-pagination.component.pcss"],
})
export class IntroPagination {
	@Select(INTRO_STATE_TOKEN)
	public intro$: Observable<IntroStateModel>;

	@Input()
	public paginationSize: Array<number>;

	constructor(private store: Store) {}
}
