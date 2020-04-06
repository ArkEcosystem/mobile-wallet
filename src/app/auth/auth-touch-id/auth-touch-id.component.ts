import { Component } from "@angular/core";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { Store } from "@ngxs/store";

@Component({
	selector: "auth-touch-id",
	templateUrl: "auth-touch-id.component.html",
})
export class AuthTouchIdComponent {
	constructor(private store: Store, private fingerprint: FingerprintAIO) {}
}
