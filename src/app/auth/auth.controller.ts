import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import {
	Actions,
	ofActionCompleted,
	ofActionSuccessful,
	Store,
} from "@ngxs/store";
import { from, Observable } from "rxjs";
import { switchMap, take, takeUntil, tap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthComponent } from "./auth.component";
import { AuthMode } from "./auth.config";
import { AuthState } from "./auth.state";

@Injectable({
	providedIn: "root",
})
export class AuthController {
	constructor(
		private actions$: Actions,
		private store: Store,
		private modalCtrl: ModalController,
	) {}

	public hasMasterPassword(): Observable<boolean> {
		return this.store.select(AuthState.hasMasterPassword);
	}

	public register() {
		const registrationModal$ = this.createModal({
			mode: AuthMode.Registration,
		});

		const confirmModal$ = this.createModal({
			mode: AuthMode.Confirmation,
		}).pipe(
			switchMap((confirmModal) =>
				this.success$.pipe(
					takeUntil(this.canceled$),
					tap(() => confirmModal.dismiss()),
				),
			),
		);

		return registrationModal$.pipe(
			switchMap((registrationModal) =>
				this.success$.pipe(
					takeUntil(this.canceled$),
					tap(() => registrationModal.dismiss(null, "self")),
					switchMap(() => confirmModal$),
				),
			),
		);
	}

	public request() {
		const modal = this.createModal({ mode: AuthMode.Authorization });
		return from(modal).pipe(
			switchMap((element) => {
				return this.success$.pipe(
					tap(() => element.dismiss()),
					takeUntil(this.canceled$),
				);
			}),
		);
	}

	private get canceled$() {
		return this.actions$.pipe(ofActionCompleted(AuthActions.Cancel));
	}

	private get success$(): Observable<AuthActions.Success> {
		return this.actions$.pipe(
			ofActionSuccessful(AuthActions.Success),
			take(1),
		);
	}

	private createModal({ mode }: { mode: AuthMode }) {
		const modal = this.modalCtrl.create({
			component: AuthComponent,
			mode: "ios",
			swipeToClose: true,
			cssClass: "modal-card c-auth-modal",
		});

		const cancelAction = new AuthActions.Cancel();
		const openAction = new AuthActions.Open({
			mode,
		});

		return from(modal).pipe(
			tap((component) => {
				component.onDidDismiss().then(({ role }) => {
					if (role !== "self") {
						this.store.dispatch(cancelAction);
					}
				});
			}),
			tap((component) => {
				component.present().then(() => this.store.dispatch(openAction));
			}),
		);
	}
}
