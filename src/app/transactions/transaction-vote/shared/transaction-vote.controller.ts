import { EventEmitter, Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { from, Observable } from "rxjs";
import { map, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";

import { Delegate } from "@/app/delegates/shared/delegate.types";

import { TransactionFormActions } from "../../shared/transaction-form-state/transaction-form.actions";
import {
	TransactionVoteComponent,
	TransactionVoteOutput,
} from "../transaction-vote.component";
import { TransactionVoteType } from "./transaction-vote.types";

@Injectable({ providedIn: "root" })
export class TransactionVoteController {
	constructor(private modalCtrl: ModalController, private store: Store) {}

	public open(payload: {
		delegate: Delegate;
		voteType: TransactionVoteType;
	}): Observable<void> {
		this.startState();

		const voteClick$ = new EventEmitter<TransactionVoteOutput>();
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
		const modal$ = from(modalElement).pipe(tap((modal) => modal.present()));

		const dismissed$ = modal$.pipe(
			switchMap((modal) => from(modal.onWillDismiss())),
		);

		const byClick$ = voteClick$.pipe(
			tap((output) => this.vote(output)),
			withLatestFrom(modal$),
			tap(([output, modal]) => modal.dismiss(output)),
			map(() => void 0),
			takeUntil(dismissed$),
		);

		return byClick$;
	}

	private startState() {
		this.store.dispatch(new TransactionFormActions.Start({}));
	}

	private vote(payload: TransactionVoteOutput) {
		this.store.dispatch(
			new TransactionFormActions.Update({
				fee: payload.fee,
				asset: {
					votes: [`${payload.voteType}${payload.delegate.username}`],
				},
			}),
		);
	}
}
