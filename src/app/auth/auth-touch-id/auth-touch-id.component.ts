import { Component } from "@angular/core";
import { Store } from "@ngxs/store";

@Component({
	selector: "auth-touch-id",
	templateUrl: "auth-touch-id.component.html",
})
export class AuthTouchIdComponent {
	constructor(private store: Store) {}
}
