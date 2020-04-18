import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { isNil } from "lodash";
import { Subject } from "rxjs";
import { switchMap, take, takeUntil, tap } from "rxjs/operators";

import { AuthController } from "@/app/auth/shared/auth.controller";
import { AuthState } from "@/app/auth/shared/auth.state";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-login",
	templateUrl: "login.html",
	styleUrls: ["login.scss"],
})
export class LoginPage implements OnInit, OnDestroy {
	public hasProfiles = false;
	public isReady = false;

	public unsubscriber = new Subject();

	constructor(
		private userDataService: UserDataService,
		private authCtlr: AuthController,
		private navCtrl: NavController,
		private store: Store,
	) {}

	ngOnInit() {
		this.store
			.select(AuthState.hasMasterPassword)
			.pipe(
				tap((result) => {
					this.hasProfiles =
						result && !isNil(this.userDataService.profiles);
					this.isReady = true;
				}),
				takeUntil(this.unsubscriber),
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.unsubscriber.next();
		this.unsubscriber.complete();
	}

	openProfileSignin(): void {
		if (this.hasProfiles) {
			this.navCtrl.navigateForward("/profile/signin");
		}
	}

	openProfileCreate(): void {
		if (this.hasProfiles) {
			return void this.navCtrl.navigateForward("/profile/create");
		}

		this.authCtlr
			.register()
			.pipe(
				take(1),
				switchMap(() =>
					this.navCtrl.navigateForward("/profile/create"),
				),
			)
			.subscribe();
	}
}
