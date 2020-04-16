import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";

import { DelegateService } from "../shared/delegate.service";
import { Delegate } from "../shared/delegate.types";

@Component({
	selector: "delegate-search",
	templateUrl: "delegate-search.component.html",
	styleUrls: ["delegate-search.component.pcss"],
})
export class DelegateSearchComponent implements OnInit {
	@Output()
	public delegateSearchClick = new EventEmitter<Delegate>();

	public results$: Observable<Delegate[]>;
	public subject = new Subject<string>();

	constructor(private delegateService: DelegateService) {}

	ngOnInit() {
		this.results$ = this.subject.pipe(
			debounceTime(1000),
			switchMap((query: string) => this.delegateService.getDelegates()),
		);
	}

	public handleClick(delegate: Delegate) {
		this.delegateSearchClick.emit(delegate);
	}

	public search(evt: CustomEvent) {
		// @ts-ignore
		const value = evt.target.value;
		this.subject.next(value);
	}
}
