import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { DelegateSearchController } from "./delegate-search/delegate-search.controller";
import { DelegateActions } from "./shared/delegate.actions";
import { DelegateState } from "./shared/delegate.state";
import { Delegate } from "./shared/delegate.types";

@Component({
	selector: "delegates",
	templateUrl: "delegates.component.html",
})
export class DelegatesComponent implements OnInit {
	@Select(DelegateState.delegates)
	public delegates$: Observable<Delegate[]>;

	private page = 0;
	private limit = 10;

	constructor(
		private store: Store,
		private delegateSearchController: DelegateSearchController,
	) {}

	ngOnInit() {
		// TODO: Workaround to wait for the state to initialize
		setTimeout(() => this.refresh(), 1500);
	}

	public refresh() {
		const page = this.page + 1;
		const limit = this.limit;

		this.store.dispatch(new DelegateActions.Refresh({ page, limit }));
	}

	public loadData(evt: CustomEvent) {
		const target = evt.target as HTMLIonInfiniteScrollElement;
		setTimeout(() => {
			this.refresh();
			target.complete();
		}, 500);
	}

	public handleSearch() {
		this.delegateSearchController.open().subscribe({
			next: (x) => console.log(1, x),
			error: (x) => console.log(2, x),
			complete: () => console.log(3),
		});
	}
}
