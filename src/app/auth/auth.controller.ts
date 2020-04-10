import { Injectable } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import {
	Actions,
	ofActionCompleted,
	ofActionSuccessful,
	Store,
} from "@ngxs/store";
import { from, Observable } from "rxjs";
import { delay, switchMap, take, takeUntil, tap } from "rxjs/operators";

import { UserDataService } from "@/services/user-data/user-data.interface";

import { AuthActions } from "./auth.actions";
import { AuthComponent } from "./auth.component";
import { AuthMode } from "./auth.types";

@Injectable({
	providedIn: "root",
})
export class AuthController {
	constructor(
		private actions$: Actions,
		private store: Store,
		private modalCtrl: ModalController,
		private translateService: TranslateService,
		private loadingCtrl: LoadingController,
		private userDateService: UserDataService,
	) {}

	public update() {
		const updateEncryption = (oldPassword: string, newPassword: string) =>
			this.translateService.get("PIN_CODE.UPDATING").pipe(
				switchMap((message) =>
					from(
						this.loadingCtrl.create({
							message,
						}),
					).pipe(
						tap((loading) => loading.present()),
						delay(1000),
						switchMap((loading) =>
							this.userDateService
								.updateWalletEncryption(
									oldPassword,
									newPassword,
								)
								.pipe(tap(() => loading.dismiss())),
						),
					),
				),
			);

		return this.request("self").pipe(
			switchMap(({ password: oldPassword }) =>
				this.register().pipe(
					switchMap(({ password: newPassword }) =>
						updateEncryption(oldPassword, newPassword),
					),
				),
			),
		);
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

	public request(dismissRole?: string) {
		const modal = this.createModal({ mode: AuthMode.Authorization });
		return from(modal).pipe(
			switchMap((element) => {
				return this.success$.pipe(
					tap(() => element.dismiss(null, dismissRole)),
					takeUntil(this.canceled$),
				);
			}),
		);
	}

	private get canceled$() {
		return this.actions$.pipe(
			ofActionCompleted(AuthActions.Cancel),
			take(1),
		);
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
