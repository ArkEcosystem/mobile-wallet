import { Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthActions } from "./auth.actions";
import { AuthState } from "./auth.state";

@Component({
	selector: "auth",
	templateUrl: "auth.component.html",
})
export class AuthComponent {
	@Select(AuthState.isOpen)
	public isOpen$: Observable<boolean>;

	constructor(private store: Store) {}

	onClose() {
		this.store.dispatch(new AuthActions.Cancel());
	}
}
