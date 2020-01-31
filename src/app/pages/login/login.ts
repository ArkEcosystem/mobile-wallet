import { PinCodeComponent } from "@/components/pin-code/pin-code";
import { AuthProvider } from "@/services/auth/auth";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";

import { AuthActions } from "@/app/auth/shared/auth.actions";
import { Store } from "@ngxs/store";
import { isNil } from "lodash";

@Component({
	selector: "page-login",
	templateUrl: "login.html",
	styleUrls: ["login.scss"],
})
export class LoginPage implements OnInit {
	@ViewChild("pinCode", { read: PinCodeComponent, static: true })
	pinCode: PinCodeComponent;

	public hasProfiles = false;
	public isReady = false;

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		private authProvider: AuthProvider,
		private userDataProvider: UserDataProvider,
		private store: Store,
	) {}

	ngOnInit() {
		this.authProvider.getMasterPassword().subscribe(master => {
			this.hasProfiles = master && !isNil(this.userDataProvider.profiles);
			this.isReady = true;
		});
	}

	openProfileSignin() {
		this.store.dispatch(new AuthActions.Request());
	}

	openProfileCreate() {
		this.pinCode.createUpdatePinCode("/profile/create");
	}
}
