import { Injectable } from "@angular/core";
import { Actions, ofActionDispatched, Store } from "@ngxs/store";

import { AuthActions } from "./auth.actions";

@Injectable()
export class AuthController {
	constructor(private actions$: Actions, private store: Store) {}

	public request() {
		this.store.dispatch(new AuthActions.Open());

		return this.actions$.pipe(ofActionDispatched(AuthActions.Validated));
	}
}
