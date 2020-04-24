import { EventEmitter, Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { from, Observable } from "rxjs";
import { map, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";

import { Delegate } from "../shared/delegate.types";
import { DelegateSearchComponent } from "./delegate-search.component";

@Injectable({ providedIn: "root" })
export class DelegateSearchController {
	constructor(private modalCtrl: ModalController) {}

	public open(): Observable<Delegate> {
		const delegateSearchClick$ = new EventEmitter<Delegate>();

		const modalElement = this.modalCtrl.create({
			component: DelegateSearchComponent,
			componentProps: {
				delegateSearchClick: delegateSearchClick$,
			},
			swipeToClose: true,
			mode: "ios",
			cssClass: "modal-card c-delegate-search-modal",
		});

		// Open modal
		const modal$ = from(modalElement).pipe(tap((modal) => modal.present()));

		const dismissed$ = modal$.pipe(
			switchMap((modal) => from(modal.onWillDismiss())),
		);

		// Emits the delegate when clicking, close the modal and end the subscription
		const byClick$ = delegateSearchClick$.pipe(
			withLatestFrom(modal$),
			tap(([delegate, modal]) => modal.dismiss(delegate)),
			map(([delegate]) => delegate),
			takeUntil(dismissed$),
		);

		return byClick$;
	}
}
