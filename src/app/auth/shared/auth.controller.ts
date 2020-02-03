import { Injectable } from "@angular/core";
import { Actions, ofActionDispatched, Store } from "@ngxs/store";
import { iif, merge, Observable, of, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthActions, AuthEvents } from "./auth.actions";
import { AuthRequestOptions } from "./auth.type";

@Injectable()
export class AuthController {
	constructor(private store: Store, private actions$: Actions) {}

	/**
	 * Request an authorization and wait for an event emitted when the user interacts
	 */
	public request(
		options?: AuthRequestOptions,
	): Observable<undefined | never> {
		const success$ = of(undefined);
		const failed$ = throwError("Failed");
		// const timeout$ = throwError("Timeout");

		const authorized$ = this.actions$.pipe(
			ofActionDispatched(AuthEvents.Authorized),
			map(() => true),
		);

		const denied$ = this.actions$.pipe(
			ofActionDispatched(AuthEvents.Denied),
			map(() => false),
		);

		return this.store.dispatch(new AuthActions.Request()).pipe(
			switchMap(() =>
				merge(authorized$, denied$).pipe(
					// timeout(10000),
					// catchError(() => {
					// 	this.store.dispatch(AuthActions.Dismiss);
					// 	return timeout$;
					// }),
					switchMap(status => iif(() => status, success$, failed$)),
				),
			),
		);
	}
}
