import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { switchMap, tap } from "rxjs/operators";

import { AuthActions } from "../auth.actions";
import { AuthConfig, AuthMode } from "../auth.config";
import { AuthService } from "../auth.service";
import { AuthState } from "../auth.state";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
	styleUrls: ["auth-pin.component.pcss"],
})
export class AuthPinComponent implements OnInit {
	public mode: AuthMode;

	public passwordRange = Array(6).fill(undefined);
	public password: number[] = [];
	public hasWrong = false;

	constructor(
		private store: Store,
		private alertCtrl: AlertController,
		private authService: AuthService,
	) {}

	ngOnInit() {
		this.store
			.select(AuthState.mode)
			.pipe(tap((mode) => (this.mode = mode)))
			.subscribe();
	}

	public handleInput(value: number) {
		if (this.password.length > 6) {
			return;
		}

		if (value === -1) {
			this.password.pop();
		} else {
			this.password.push(value);
		}

		if (this.password.length === 6) {
			setTimeout(() => this.validate(), 20);
		}
	}

	private validate() {
		switch (this.mode) {
			case AuthMode.Authorization:
				this.validateAuthorization();
				break;
			case AuthMode.Registration:
				this.validateRegistration();
				break;
			case AuthMode.Confirmation:
				this.validateConfirmation();
				break;
		}
	}

	private async validateRegistration() {
		const passwordRaw = this.password.join("");
		if (AuthConfig.WEAK_PASSWORDS.includes(passwordRaw)) {
			const weakConfirmation = await this.alertCtrl.create({
				header: "WEAK",
				message: "WEAKER",
				backdropDismiss: false,
				buttons: [
					{
						text: "NO",
						handler: () => {
							this.password = [];
						},
					},
					{
						text: "YES",
						handler: () => {
							return this.store.dispatch(
								new AuthActions.Success(passwordRaw),
							);
						},
					},
				],
			});
			weakConfirmation.present();
		}
	}

	private validateConfirmation() {}

	private validateAuthorization() {
		const passwordRaw = this.password.join("");
		this.authService
			.validateMasterPassword(passwordRaw)
			.pipe(
				switchMap(() =>
					this.store.dispatch(new AuthActions.Success(passwordRaw)),
				),
			)
			.subscribe({
				error: () => this.handleWrong(),
			});
	}

	private handleWrong() {
		this.hasWrong = true;
		this.password = [];
		setTimeout(() => {
			this.hasWrong = false;
		}, 500);
	}
}
