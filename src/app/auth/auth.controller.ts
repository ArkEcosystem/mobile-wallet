import { Injectable } from "@angular/core";
import {
	Actions,
	ofActionCompleted,
	ofActionSuccessful,
	Store,
} from "@ngxs/store";
import { takeUntil } from "rxjs/operators";

import { AuthActions } from "./auth.actions";

@Injectable()
export class AuthController {
	constructor(private actions$: Actions, private store: Store) {}

	public request() {
		this.store.dispatch(new AuthActions.Open());

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
