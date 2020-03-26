import { ActivatedRoute } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { PrivateKey, PublicKey } from "ark-ts";
import * as bip39 from "bip39";
import { EMPTY, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { Wallet } from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NetworkProvider } from "@/services/network/network";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

export abstract class BaseWalletImport {
	public existingAddress: string;
	protected wordlistLanguage: string;

	constructor(
		protected route: ActivatedRoute,
		protected navCtrl: NavController,
		private userDataService: UserDataService,
		private arkApiProvider: ArkApiProvider,
		protected toastProvider: ToastProvider,
		private modalCtrl: ModalController,
		private networkProvider: NetworkProvider,
		private settingsDataProvider: SettingsDataProvider,
	) {
		this.existingAddress = route.snapshot.queryParamMap.get("address");
		this.settingsDataProvider.settings.subscribe(
			(settings) => (this.wordlistLanguage = settings.wordlistLanguage),
		);
	}

	protected import(
		address?: string,
		passphrase?: string,
		checkBIP39Passphrase?: boolean,
	): Observable<never> {
		let privateKey;
		let publicKey;

		address = address ? address.trim() : address;
		passphrase = passphrase ? passphrase.trim() : passphrase;

		if (address) {
			if (!this.networkProvider.isValidAddress(address)) {
				this.toastProvider.error("WALLETS_PAGE.IMPORT_INVALID_ADDRESS");
				return;
			}
			publicKey = PublicKey.fromAddress(address);
			publicKey.setNetwork(this.networkProvider.currentNetwork);
		} else {
			// test: import from passphrase here
			if (checkBIP39Passphrase && !this.validateMnemonic(passphrase)) {
				// passphrase is not a valid BIP39 mnemonic
				this.toastProvider.error("WALLETS_PAGE.PASSPHRASE_NOT_BIP39");
				return;
			}
			privateKey = PrivateKey.fromSeed(
				passphrase,
				this.networkProvider.currentNetwork,
			);
			publicKey = privateKey.getPublicKey();
			address = publicKey.getAddress();
		}

		if (this.existingAddress && address !== this.existingAddress) {
			this.toastProvider.error(
				{
					key: "WALLETS_PAGE.PASSPHRASE_NOT_BELONG_TO_ADDRESS",
					parameters: { address: this.existingAddress },
				},
				4000,
			);
			return EMPTY;
		}

		if (!publicKey) {
			return EMPTY;
		}

		let newWallet = new Wallet(!privateKey);

		return new Observable((observer) => {
			this.arkApiProvider.client
				.getWallet(address)
				.pipe(
					finalize(() => {
						if (!privateKey) {
							this.addWallet(newWallet);
						} else {
							// if we are converting watch-only to full wallet, keep label from existing watch-only wallet
							const existingWallet = this.userDataService.getWalletByAddress(
								address,
							);
							if (existingWallet) {
								newWallet.label = existingWallet.label;
								newWallet.transactions =
									existingWallet.transactions;
							}

							this.verifyWithPinCode(newWallet, passphrase);
						}
						observer.next();
						observer.complete();
					}),
				)
				.subscribe(
					(response) => {
						newWallet = newWallet.deserialize(response);
					},
					() => {
						// Empty wallet
						newWallet.address = address;
						newWallet.publicKey = publicKey.toHex();
					},
				);
		});
	}

	private async verifyWithPinCode(
		newWallet: Wallet,
		passphrase: string,
	): Promise<void> {
		const modal = await this.modalCtrl.create({
			component: PinCodeModal,
			componentProps: {
				message: "PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE",
				outputPassword: true,
				validatePassword: true,
			},
		});

		modal.onDidDismiss().then(({ data }) => {
			if (data) {
				this.addWallet(newWallet, passphrase, data);
			} else {
				this.toastProvider.error("WALLETS_PAGE.ADD_WALLET_ERROR");
			}
		});

		modal.present();
	}

	private addWallet(
		newWallet: Wallet,
		passphrase?: string,
		password?: string,
	): void {
		this.userDataService
			.addWallet(newWallet, passphrase, password)
			.subscribe(() => {
				this.navCtrl.navigateRoot("/wallets/dashboard", {
					queryParams: {
						address: newWallet.address,
					},
				});
			});
	}

	private validateMnemonic(passphrase: string) {
		const wordlist = bip39.wordlists[this.wordlistLanguage || "english"];
		if (
			bip39.validateMnemonic(passphrase, wordlist) ||
			bip39.validateMnemonic(passphrase)
		) {
			return true;
		}
		return false;
	}
}
