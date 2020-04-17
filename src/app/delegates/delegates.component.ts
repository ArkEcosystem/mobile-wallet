import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { DelegateSearchController } from "./delegate-search/delegate-search.controller";
import { DelegateActions } from "./shared/delegate.actions";
import { DelegateState } from "./shared/delegate.state";
import { Delegate } from "./shared/delegate.types";

@Component({
	templateUrl: "delegates.component.html",
	styleUrls: ["delegates.component.pcss"],
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
		this.store.select((state) => state).subscribe(console.log);
		// this.delegates$.pipe(tap((x) => console.log(1, x))).subscribe();
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
