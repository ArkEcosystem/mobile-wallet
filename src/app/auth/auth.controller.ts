import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import {
	Actions,
	ofActionCompleted,
	ofActionSuccessful,
	Store,
} from "@ngxs/store";
import { from } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthComponent } from "./auth.component";
import { AuthMode } from "./auth.config";

@Injectable()
export class AuthController {
	constructor(
		private actions$: Actions,
		private store: Store,
		private modalCtrl: ModalController,
	) {}

	public register() {
		const modal = this.createModal({ mode: AuthMode.Registration });
		return from(modal).pipe(
			switchMap((element) => {
				return this.success$.pipe(
					tap(() => element.dismiss()),
					takeUntil(this.canceled$),
				);
			}),
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

	private get success$() {
		return this.actions$.pipe(ofActionSuccessful(AuthActions.Success));
	}

	private async createModal({ mode }: { mode: AuthMode }) {
		const modal = await this.modalCtrl.create({
			component: AuthComponent,
			mode: "ios",
			swipeToClose: true,
			cssClass: "modal-card c-auth-modal",
		});

		const cancelAction = new AuthActions.Cancel();
		const openAction = new AuthActions.Open({
			mode,
		});

		modal.onDidDismiss().then(() => this.store.dispatch(cancelAction));
		modal.present().then(() => this.store.dispatch(openAction));

		return modal;
	}
}
