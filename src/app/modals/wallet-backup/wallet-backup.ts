import { Component, Input, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { PrivateKey } from "ark-ts/core";
import * as bip39 from "bip39";

import { AccountBackup, WalletKeys } from "@/models/model";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { PassphraseWordTesterModal } from "../passphrase-word-tester/passphrase-word-tester";

@Component({
	selector: "modal-wallet-backup",
	templateUrl: "wallet-backup.html",
	styleUrls: ["wallet-backup.pcss"],
})
export class WalletBackupModal implements OnInit {
	@Input()
	public title: string;

	@Input()
	public entropy: string;

	@Input()
	public keys: WalletKeys;

	@Input()
	public message: string;
	public showAdvancedOptions = false;

	public account: AccountBackup;

	private currentNetwork;
	private wordlistLanguage: string;

	constructor(
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		private userDataService: UserDataService,
		private settingsDataProvider: SettingsDataProvider,
	) {
		if (!this.title || (!this.entropy && !this.keys)) {
			this.dismiss();
		}

		this.currentNetwork = this.userDataService.currentNetwork;
		this.settingsDataProvider.settings.subscribe(
			(settings) => (this.wordlistLanguage = settings.wordlistLanguage),
		);
	}

	async next() {
		if (!this.account || !this.account.mnemonic) {
			this.dismiss(this.account);
		}

		const wordTesterModal = await this.modalCtrl.create({
			component: PassphraseWordTesterModal,
			componentProps: {
				passphraseReference: this.account.mnemonic,
				wordlistLanguage: this.wordlistLanguage,
			},
		});

		wordTesterModal.onDidDismiss().then(({ data }) => {
			setTimeout(() => {
				if (data) {
					this.dismiss(this.account);
				}
			}, 0);
		});

		wordTesterModal.present();
	}

	dismiss(result?: any) {
		this.modalCtrl.dismiss(result);
	}

	toggleAdvanced() {
		this.showAdvancedOptions = !this.showAdvancedOptions;
	}

	ngOnInit() {
		if (this.keys) {
			return this.generateAccountFromKeys();
		}

		this.generateAccountFromEntropy();
	}

	private generateAccountFromKeys() {
		const pvKey = PrivateKey.fromSeed(this.keys.key, this.currentNetwork);
		const pbKey = pvKey.getPublicKey();
		pbKey.setNetwork(this.currentNetwork);

		const wallet = this.userDataService.getWalletByAddress(
			pbKey.getAddress(),
		);

		const account: AccountBackup = {};
		account.address = wallet.address;
		account.mnemonic = this.keys.key;
		account.publicKey = pbKey.toHex();
		account.seed = bip39
			.mnemonicToSeedSync(account.mnemonic)
			.toString("hex");
		if (pbKey.network.wif) {
			account.wif = pvKey.toWIF();
		}

		if (this.keys.secondKey) {
			account.secondMnemonic = this.keys.secondKey;
		}

		this.account = account;
	}

	private generateAccountFromEntropy() {
		const account: AccountBackup = {};
		const wordlist = bip39.wordlists[this.wordlistLanguage || "english"];

		account.entropy = this.entropy;
		account.mnemonic = bip39.entropyToMnemonic(account.entropy, wordlist);

		const pvKey = PrivateKey.fromSeed(
			account.mnemonic,
			this.currentNetwork,
		);
		const pbKey = pvKey.getPublicKey();

		account.address = pbKey.getAddress();
		account.publicKey = pbKey.toHex();
		if (pbKey.network.wif) {
			account.wif = pvKey.toWIF();
		}
		account.seed = bip39
			.mnemonicToSeedSync(account.mnemonic)
			.toString("hex");

		this.account = account;
	}
}
