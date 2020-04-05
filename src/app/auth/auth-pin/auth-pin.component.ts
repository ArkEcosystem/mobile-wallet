import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

import { AuthActions } from "../auth.actions";
import { AuthMode } from "../auth.config";
import { AuthService } from "../auth.service";
import { AuthState } from "../auth.state";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
	styleUrls: ["auth-pin.component.pcss"],
})
export class AuthPinComponent implements OnInit, OnDestroy {
	public mode: AuthMode;

	public passwordLength = 6;
	public passwordRange = Array(this.passwordLength).fill(undefined);
	public password: number[] = [];
	public hasWrong = false;

	private unsubscriber$ = new Subject();

	constructor(
		private store: Store,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
		private authService: AuthService,
	) {}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	ngOnInit() {
		this.store
			.select(AuthState.mode)
			.pipe(
				tap((mode) => (this.mode = mode)),
				takeUntil(this.unsubscriber$),
			)
			.subscribe();
	}

	public handleInput(value: number): void {
		if (this.password.length > this.passwordLength) {
			return;
		}

		if (value === -1) {
			this.password.pop();
		} else {
			this.password.push(value);
		}

		if (this.password.length === this.passwordLength) {
			setTimeout(() => this.validate(), 20);
		}
	}

	private validate(): void {
		const passwordRaw = this.password.join("");
		const isRegistration = this.mode === AuthMode.Registration;
		const validation = isRegistration
			? this.validateRegistration(passwordRaw)
			: this.validatePassword(passwordRaw);

		validation.pipe(takeUntil(this.unsubscriber$)).subscribe();
	}

	private validateRegistration(password: string): Observable<any> {
		if (this.authService.isWeakPassword(password)) {
			return this.translateService
				.get([
					"NO",
					"YES",
					"PIN_CODE.WEAK_PIN",
					"PIN_CODE.WEAK_PIN_DETAIL",
				])
				.pipe(
					tap(async (translation) => {
						const weakConfirmation = await this.alertCtrl.create({
							header: translation["PIN_CODE.WEAK_PIN"],
							message: translation["PIN_CODE.WEAK_PIN_DETAIL"],
							backdropDismiss: false,
							buttons: [
								{
									text: translation["NO"],
									handler: () => {
										this.password = [];
									},
								},
								{
									text: translation["YES"],
									handler: () => {
										return this.store.dispatch([
											new AuthActions.Success(password),
										]);
									},
								},
							],
						});
						weakConfirmation.present();
					}),
				);
		}
		return this.store.dispatch([new AuthActions.Success(password)]);
	}

	private validatePassword(password: string): Observable<any> {
		return this.store
			.dispatch(new AuthActions.ValidatePassword(password))
			.pipe(
				catchError((e) => {
					this.handleWrong();
					return e;
				}),
			);
	}

	private handleWrong() {
		this.hasWrong = true;
		this.password = [];
		setTimeout(() => {
			this.hasWrong = false;
		}, 500);
	}
}
