import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NavController } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { iif, Observable, of } from "rxjs";
import { concatMap, take, withLatestFrom } from "rxjs/operators";

import { AuthController } from "../auth/shared/auth.controller";
import { AuthState } from "../auth/shared/auth.state";
import { ProfileActions } from "../profiles/shared/profile.actions";
import { ProfileState } from "../profiles/shared/profile.state";
import { Profile } from "../profiles/shared/profile.types";

@Component({
	selector: "signup",
	templateUrl: "signup.component.html",
})
export class SignupComponent implements OnInit {
	@Select(ProfileState.profiles)
	public profiles$: Observable<Profile[]>;

	@Select(AuthState.hasMasterPassword)
	public hasMasterPassword$: Observable<boolean>;

	public formGroup = new FormGroup({
		name: new FormControl("", [Validators.required]),
	});

	constructor(
		private store: Store,
		private navCtrl: NavController,
		private authCtrl: AuthController,
	) {}

	ngOnInit() {}

	public handleSignin() {}

	public handleNext() {
		const name = this.formGroup.get("name").value;

		this.hasMasterPassword$
			.pipe(
				concatMap((hasMasterPassword) =>
					iif(
						() => hasMasterPassword,
						of(undefined),
						this.authCtrl.register(),
					),
				),
				concatMap(() =>
					this.store
						.dispatch(new ProfileActions.Add({ name }))
						.pipe(withLatestFrom(this.profiles$)),
				),
				take(1),
			)
			.subscribe(([_, profiles]) => {
				const { profileId } = profiles.slice(-1)[0];
				this.navCtrl.navigateRoot(`profile/${profileId}`);
			});
	}
}
