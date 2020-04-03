import { Component } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthState } from "./auth.state";

@Component({
	selector: "auth",
	templateUrl: "auth.component.html",
})
export class AuthComponent {
	@Select(AuthState.isOpen)
	public isOpen$: Observable<boolean>;

	constructor() {}
}
