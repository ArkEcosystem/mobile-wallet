import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import {
	Actions,
	ofActionCompleted,
	ofActionSuccessful,
	Store,
} from "@ngxs/store";
import { takeUntil } from "rxjs/operators";

import { AuthActions } from "./auth.actions";
import { AuthComponent } from "./auth.component";

@Injectable()
export class AuthController {
	constructor(
		private actions$: Actions,
		private store: Store,
		private modalCtrl: ModalController,
	) {}

	public request() {
		this.modalCtrl
			.create({
				component: AuthComponent,
				mode: "ios",
				swipeToClose: true,
				cssClass: "modal-card c-auth-modal",
			})
			.then((x) => {
				x.onDidDismiss().then(() =>
					this.store.dispatch(new AuthActions.Cancel()),
				);
				x.present().then(() =>
					this.store.dispatch(new AuthActions.Open()),
				);
			});

		const canceled$ = this.actions$.pipe(
			ofActionCompleted(AuthActions.Cancel),
		);

		const validated$ = this.actions$.pipe(
			ofActionSuccessful(AuthActions.Validate),
			takeUntil(canceled$),
		);

		return validated$;
	}
}
