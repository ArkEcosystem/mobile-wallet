import { EventEmitter, Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { from, Observable } from "rxjs";
import { map, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";

import { Delegate } from "@/app/delegates/shared/delegate.types";

import { TransactionVoteType } from "../shared/transaction.types";
import { TransactionVoteComponent } from "./transaction-vote.component";

@Injectable({ providedIn: "root" })
export class TransactionVoteController {
	constructor(private modalCtrl: ModalController) {}

	public open(payload: {
		delegate: Delegate;
		type: TransactionVoteType;
	}): Observable<any> {
		const voteClick$ = new EventEmitter();
		const modalElement = this.modalCtrl.create({
			component: TransactionVoteComponent,
			componentProps: {
				delegate: payload.delegate,
				type: payload.type,
				transactionVoteClick: voteClick$,
			},
			mode: "ios",
			cssClass: "modal-card transaction-vote-modal",
			swipeToClose: true,
		});

		// Open modal
		const modal$ = from(modalElement).pipe(tap((modal) => modal.present()));

		const dismissed$ = modal$.pipe(
			switchMap((modal) => from(modal.onWillDismiss())),
		);

		const byClick$ = voteClick$.pipe(
			withLatestFrom(modal$),
			tap(([result, modal]) => modal.dismiss(result)),
			map(([result]) => result),
			takeUntil(dismissed$),
		);

		return byClick$;
	}
}
