import { EventEmitter, Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { from, Observable } from "rxjs";
import {
	map,
	shareReplay,
	switchMap,
	takeUntil,
	tap,
	withLatestFrom,
} from "rxjs/operators";

import { Delegate } from "@/app/delegates/shared/delegate.types";

import { TransactionVoteComponent } from "../transaction-vote.component";
import { TransactionVoteType } from "./transaction-vote.types";

@Injectable({ providedIn: "root" })
export class TransactionVoteController {
	constructor(private modalCtrl: ModalController) {}

	public open(payload: {
		delegate: Delegate;
		voteType: TransactionVoteType;
	}): Observable<void> {
		const voteClick$ = new EventEmitter();
		const modalElement = this.modalCtrl.create({
			component: TransactionVoteComponent,
			componentProps: {
				delegate: payload.delegate,
				voteType: payload.voteType,
				transactionVoteClick: voteClick$,
			},
			mode: "ios",
			cssClass: "modal-card transaction-vote-modal",
			swipeToClose: true,
		});

		// Open modal
		const modal$ = from(modalElement).pipe(
			tap((modal) => modal.present()),
			shareReplay(1),
		);

		const dismissed$ = modal$.pipe(
			switchMap((modal) => from(modal.onWillDismiss())),
		);

		const byClick$ = voteClick$.pipe(
			withLatestFrom(modal$),
			tap(([_, modal]) => modal.dismiss()),
			map(() => void 0),
			takeUntil(dismissed$),
		);

		return byClick$;
	}
}
