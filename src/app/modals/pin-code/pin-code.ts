import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Vibration } from "@ionic-native/vibration/ngx";
import {
	AlertController,
	ModalController,
	NavController,
	NavParams,
	Platform,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";
import moment from "moment";
import { Subscription, timer } from "rxjs";
import { finalize, map, takeWhile } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { AuthProvider } from "@/services/auth/auth";

@Component({
	selector: "modal-pin-code",
	templateUrl: "pin-code.html",
	styleUrls: ["pin-code.pcss"],
	providers: [Vibration],
})
export class PinCodeModal implements OnInit, OnDestroy {
	public password: string;
	public isWrong = false;

	public unlockDiff = 0;
	public unlockCountdown$: Subscription;

	@Input()
	public message: string;

	// Send a password created before, useful for create pin and confirm
	@Input()
	private expectedPassword: string;

	// Will send back the entered password
	@Input()
	private outputPassword = false;

	// Check if the entered password is correct
	@Input()
	private validatePassword = false;

	private length = 6;
	private attempts = 0;

	constructor(
		public platform: Platform,
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		private authProvider: AuthProvider,
		private zone: NgZone,
		private vibration: Vibration,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
	) {
		this.password = "";
	}

	add(value: number) {
		if (this.unlockDiff > 0) {
			return;
		}

		if (this.password.length < this.length) {
			this.zone.run(() => {
				this.password = this.password + value;
			});

			// When the user reach the password length
			if (this.password.length === this.length) {
				// New password
				if (!this.expectedPassword && !this.validatePassword) {
					if (this.authProvider.isWeakPassword(this.password)) {
						// Show message about weak PIN
						this.translateService
							.get([
								"PIN_CODE.WEAK_PIN",
								"PIN_CODE.WEAK_PIN_DETAIL",
								"NO",
								"YES",
							])
							.subscribe(async (translation) => {
								const alert = await this.alertCtrl.create({
									header: translation["PIN_CODE.WEAK_PIN"],
									message:
										translation["PIN_CODE.WEAK_PIN_DETAIL"],
									buttons: [
										{
											text: translation.NO,
											handler: () => {
												this.password = "";
											},
										},
										{
											text: translation.YES,
											handler: () => {
												this.dismiss(true);
											},
										},
									],
								});
								alert.present();
							});
					} else {
						return this.dismiss(true);
					}
				}

				// Confirm with the previous entered password (validate new password)
				if (this.expectedPassword) {
					if (this.expectedPassword !== this.password) {
						this.setWrong();
					} else {
						this.dismiss(true);
					}
				}

				// Compare the password entered with the saved in the storage
				if (this.validatePassword) {
					this.authProvider
						.validateMasterPassword(this.password)
						.subscribe((result) => {
							if (!result) {
								this.setWrong();
							} else {
								this.dismiss(true);
							}
						});
				}
			}
		}
	}

	verifyAttempts() {
		if (this.attempts >= constants.PIN_ATTEMPTS_LIMIT) {
			this.authProvider
				.increaseUnlockTimestamp()
				.then(() => this.loadUnlockTime());
		}
	}

	setWrong() {
		this.vibration.vibrate(constants.VIBRATION_TIME_LONG_MS);

		this.authProvider.increaseAttempts().subscribe((newAttempts) => {
			this.attempts = newAttempts;
			this.verifyAttempts();

			this.zone.run(() => {
				this.isWrong = true;
				this.password = "";
				this.message = "PIN_CODE.WRONG";

				setTimeout(() => (this.isWrong = false), 500);
			});
		});
	}

	delete() {
		if (this.password.length > 0) {
			this.zone.run(() => {
				this.password = this.password.substring(
					0,
					this.password.length - 1,
				);
			});
		}
	}

	dismiss(status: boolean = true) {
		if (!status) {
			return this.modalCtrl.dismiss();
		}

		// When logged in, the attempts are restarted
		if (status) {
			this.authProvider.clearAttempts().subscribe();
		}

		if (this.outputPassword) {
			this.modalCtrl.dismiss(this.password);
			return;
		}

		this.modalCtrl.dismiss(status);
	}

	ngOnInit() {
		this.authProvider
			.getAttempts()
			.subscribe((attempts) => (this.attempts = attempts));
		this.loadUnlockTime();
	}

	ngOnDestroy() {
		if (this.unlockCountdown$) {
			this.unlockCountdown$.unsubscribe();
		}
	}

	private loadUnlockTime() {
		this.authProvider.getUnlockTimestamp().subscribe((timestamp) => {
			if (!timestamp || lodash.isEmpty(timestamp)) {
				return;
			}

			// If an unlock time is set in storage
			// Check if this time has already been spent
			const now = moment.now();
			const diff = moment(timestamp).diff(now, "seconds");

			if (diff <= 0) {
				this.authProvider.clearAttempts().subscribe();
				this.attempts = 0;
				return this.loadUnlockTime();
			}

			this.unlockDiff = diff;

			this.password = "";
			this.message = "PIN_CODE.WRONG_PIN_MANY_TIMES";

			// Start the countdown
			this.unlockCountdown$ = timer(0, 1000)
				.pipe(
					map((x) => this.zone.run(() => this.unlockDiff--)),
					takeWhile(() => this.unlockDiff > 0),
					finalize(() =>
						this.zone.run(
							() => (this.message = "PIN_CODE.DEFAULT_MESSAGE"),
						),
					),
				)
				.subscribe();
		});
	}
}
