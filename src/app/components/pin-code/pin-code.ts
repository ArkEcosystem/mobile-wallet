import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
	LoadingController,
	ModalController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";

import { EnterSecondPassphraseModal } from "@/app/modals/enter-second-passphrase/enter-second-passphrase";
import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { Wallet, WalletKeys } from "@/models/model";
import { AuthProvider } from "@/services/auth/auth";
import { LoggerService } from "@/services/logger/logger.service";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "pin-code",
	templateUrl: "pin-code.html",
})
export class PinCodeComponent {
	@Input()
	wallet: Wallet;

	@Output()
	success: EventEmitter<WalletKeys> = new EventEmitter();

	@Output()
	wrong: EventEmitter<void> = new EventEmitter();

	@Output()
	close: EventEmitter<void> = new EventEmitter();

	constructor(
		private userDataService: UserDataService,
		private authProvider: AuthProvider,
		private toastProvider: ToastProvider,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private loadingCtrl: LoadingController,
		private translateService: TranslateService,
		private loggerService: LoggerService,
	) {}

	async open(
		message: string,
		outputPassword: boolean,
		verifySecondPassphrase: boolean = false,
		onSuccess?: (keys: WalletKeys) => void,
	) {
		if (outputPassword && !this.wallet) {
			return false;
		}

		const modal = await this.modalCtrl.create({
			component: PinCodeModal,
			componentProps: {
				message,
				outputPassword,
				validatePassword: true,
			},
		});

		modal.onDidDismiss().then(async ({ data }) => {
			if (lodash.isNil(data)) {
				return this.close.emit();
			}

			const loader = await this.loadingCtrl.create({
				backdropDismiss: false,
				showBackdrop: true,
			});

			loader.present();

			if (!outputPassword) {
				loader.dismiss();
				return this.executeOnSuccess(onSuccess);
			}

			const passphrases = this.userDataService.getKeysByWallet(
				this.wallet,
				data,
			);
			loader.dismiss();

			if (lodash.isEmpty(passphrases) || lodash.isNil(passphrases)) {
				return this.wrong.emit();
			}

			if (verifySecondPassphrase) {
				return this.requestSecondPassphrase(passphrases, onSuccess);
			}
			return this.executeOnSuccess(onSuccess, passphrases);
		});

		modal.present();
	}

	createUpdatePinCode(nextPage?: string, oldPassword?: string) {
		const createPinCodeModalFunc = async (master?: any) => {
			if (!master) {
				const pinCodeModal = await this.modalCtrl.create({
					component: PinCodeModal,
					componentProps: {
						message: "PIN_CODE.CREATE",
						outputPassword: true,
					},
				});

				pinCodeModal.onDidDismiss().then(async ({ data: password }) => {
					if (password) {
						const validateModal = await this.modalCtrl.create({
							component: PinCodeModal,
							componentProps: {
								message: "PIN_CODE.CONFIRM",
								expectedPassword: password,
							},
						});

						validateModal
							.onDidDismiss()
							.then(({ data: status }) => {
								const continueWithSuccess = (
									successMessageKey: string,
								) => {
									this.toastProvider.success(
										successMessageKey,
									);
									if (nextPage) {
										this.navCtrl.navigateForward(nextPage);
									}
								};

								if (status) {
									this.authProvider
										.saveMasterPassword(password)
										.subscribe();

									if (oldPassword) {
										this.translateService
											.get("PIN_CODE.UPDATING")
											.subscribe(async (updatingText) => {
												const loading = await this.loadingCtrl.create(
													{ message: updatingText },
												);
												loading.present().then(() => {
													this.userDataService.updateWalletEncryption(
														oldPassword,
														password,
													);
													loading.dismiss();
													continueWithSuccess(
														"PIN_CODE.PIN_UPDATED_TEXT",
													);
												});
											});
									} else {
										continueWithSuccess(
											"PIN_CODE.PIN_CREATED_TEXT",
										);
									}
								} else {
									this.toastProvider.error(
										oldPassword
											? "PIN_CODE.PIN_UPDATED_ERROR_TEXT"
											: "PIN_CODE.PIN_CREATED_ERROR_TEXT",
									);
								}
							});

						validateModal.present();
					} else {
						this.toastProvider.error(
							oldPassword
								? "PIN_CODE.PIN_UPDATED_ERROR_TEXT"
								: "PIN_CODE.PIN_CREATED_ERROR_TEXT",
						);
					}
				});

				pinCodeModal.present();
			} else if (nextPage) {
				this.navCtrl.navigateForward(nextPage);
			}
		};
		if (!oldPassword) {
			this.authProvider
				.getMasterPassword()
				.subscribe(createPinCodeModalFunc);
		} else {
			createPinCodeModalFunc();
		}
	}

	private async requestSecondPassphrase(
		passphrases: WalletKeys,
		onSuccess: (keys: WalletKeys) => void,
	) {
		const hasSecondPublicKey = !!(
			this.wallet.attributes?.secondPublicKey ||
			this.wallet.secondPublicKey
		);
		if (hasSecondPublicKey && !this.wallet.cipherSecondKey) {
			const modal = await this.modalCtrl.create({
				component: EnterSecondPassphraseModal,
			});

			modal.onDidDismiss().then(({ data }) => {
				if (!data) {
					this.toastProvider.error(
						"TRANSACTIONS_PAGE.SECOND_PASSPHRASE_NOT_ENTERED",
					);
					return this.wrong.emit();
				}

				passphrases.secondPassphrase = data;
				return this.executeOnSuccess(onSuccess, passphrases);
			});

			modal.present();
		} else {
			return this.executeOnSuccess(onSuccess, passphrases);
		}
	}

	private executeOnSuccess(
		onSuccess: (keys: WalletKeys) => any,
		keys?: WalletKeys,
	): void {
		this.loggerService.info("PIN code authorized");
		if (onSuccess) {
			onSuccess(keys);
		}
		return this.success.emit(keys);
	}
}
