import { Component, OnDestroy, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { exhaustMap } from "rxjs/operators";

import { TransactionVoteType } from "../transactions/shared/transaction.types";
import { TransactionVoteController } from "../transactions/transaction-vote/transaction-vote.controller";
import { DelegateSearchController } from "./delegate-search/delegate-search.controller";
import { DelegateActions } from "./shared/delegate.actions";
import { DelegateState } from "./shared/delegate.state";
import { Delegate } from "./shared/delegate.types";

@Component({
	selector: "delegates",
	templateUrl: "delegates.component.html",
})
export class DelegatesComponent implements OnInit, OnDestroy {
	@Select(DelegateState.delegates)
	public delegates$: Observable<Delegate[]>;

	private page = 0;
	private limit = 10;

	private unsubscriber$ = new Subject();

	constructor(
		private store: Store,
		private delegateSearchCtrl: DelegateSearchController,
		private transactionVoteCtrl: TransactionVoteController,
	) {}

	ngOnInit() {
		// TODO: Workaround to wait for the state to initialize
		setTimeout(() => this.refresh(), 1500);
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	public refresh() {
		const page = this.page + 1;
		const limit = this.limit;

		this.store.dispatch(new DelegateActions.Fetch({ page, limit }));
	}

	public loadData(evt: CustomEvent) {
		const target = evt.target as HTMLIonInfiniteScrollElement;
		setTimeout(() => {
			this.refresh();
			target.complete();
		}, 500);
	}

	public handleDelegateUnvoteBannerClick() {}

	public handleDelegateListClick(delegate: Delegate) {
		this.openTransactionVote(delegate).subscribe(console.log);
	}

	public handleSearch() {
		this.delegateSearchCtrl
			.open()
			.pipe(exhaustMap((delegate) => this.openTransactionVote(delegate)))
			.subscribe(console.log);
	}

	private openTransactionVote(delegate: Delegate) {
		return this.transactionVoteCtrl.open({
			delegate,
			type: TransactionVoteType.Vote,
		});
	}
}
