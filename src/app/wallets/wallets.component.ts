import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
	ActionSheetController,
	IonContent,
	ModalController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Network } from "ark-ts/model";
import lodash from "lodash";
import { Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { AuthController } from "@/app/auth/shared/auth.controller";
import { GenerateEntropyModal } from "@/app/modals/generate-entropy/generate-entropy";
import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import { MarketCurrency, Profile, Wallet } from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "wallets-component",
	templateUrl: "wallets.component.html",
	styleUrls: ["wallets.component.scss"],
})
export class WalletsComponent implements OnInit, OnDestroy {
	@ViewChild("content", { read: IonContent, static: true })
	content: IonContent;

	public currentProfile: Profile;
	public currentNetwork: Network;
	public wallets: Wallet[] = [];
	public totalBalance: number;
	public selectedWallet: Wallet;

	public fiatCurrency: MarketCurrency;
	public fiatBalance: number;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public navCtrl: NavController,
		private userDataService: UserDataService,
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private translateService: TranslateService,
		private settingsDataProvider: SettingsDataProvider,
		private arkApiProvider: ArkApiProvider,
		private authCtrl: AuthController,
	) {}

	ngOnInit() {
		this.loadUserData();

		this.userDataService.clearCurrentWallet();
	}

	openWalletDashboard(wallet: Wallet) {
		this.navCtrl
			.navigateForward("/wallets/dashboard", {
				queryParams: {
					address: wallet.address,
				},
			})
			.then(() => {
				this.userDataService
					.updateWallet(wallet, this.currentProfile.profileId)
					.subscribe(() => {
						this.loadWallets();
					});
			});
	}

	openImportPage() {
		this.navCtrl.navigateForward("wallets/import-new");
	}

	presentActionSheet() {
		this.translateService
			.get([
				"WALLETS_PAGE.SCAN_QRCODE",
				"IMPORT_PASSPHRASE",
				"IMPORT_ADDRESS",
			])
			.subscribe(async (translation) => {
				const actionSheet = await this.actionSheetCtrl.create({
					buttons: [
						{
							text: translation["WALLETS_PAGE.SCAN_QRCODE"],
							role: "qrcode",
							icon: "qr-code",
							handler: () => {
								this.presentWalletImport("qrcode");
							},
						},
						{
							text: translation.IMPORT_PASSPHRASE,
							role: "passphrase",
							icon: "lock-closed",
							handler: () => {
								this.presentWalletImport("passphrase");
							},
						},
						{
							text: translation.IMPORT_ADDRESS,
							role: "address",
							icon: "globe",
							handler: () => {
								this.presentWalletImport("address");
							},
						},
					],
				});

				actionSheet.present();
			});
	}

	ionViewDidEnter() {
		this.loadWallets();
		this.onCreateUpdateWallet();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	public async presentWalletGenerate() {
		const modal = await this.modalCtrl.create({
			component: GenerateEntropyModal,
		});

		modal.onDidDismiss().then(async ({ data: entropy }) => {
			if (!entropy) {
				return;
			}

			const showModal = await this.modalCtrl.create({
				component: WalletBackupModal,
				componentProps: {
					title: "WALLETS_PAGE.CREATE_WALLET",
					entropy,
				},
			});

			showModal.onDidDismiss().then(({ data: account }) => {
				if (!account) {
					return;
				}

				this.storeWallet(account);
			});

			showModal.present();
		});

		modal.present();
	}

	public presentWalletImport(role: string) {
		if (role === "qrcode") {
			this.navCtrl.navigateForward("/wallets/import");
		} else {
			this.navCtrl.navigateForward("/wallets/import-manual", {
				queryParams: {
					type: role,
				},
			});
		}
	}

	private storeWallet(account) {
		const wallet = new Wallet();
		wallet.address = account.address;
		wallet.publicKey = account.publicKey;

		this.authCtrl
			.request()
			.pipe(
				switchMap(({ password }) =>
					this.userDataService.addWallet(
						wallet,
						account.mnemonic,
						password,
					),
				),
				tap(() => this.loadWallets()),
				takeUntil(this.unsubscriber$),
			)
			.subscribe();
	}

	private loadWallets() {
		this.loadUserData();
		if (
			!this.currentProfile ||
			lodash.isEmpty(this.currentProfile.wallets)
		) {
			this.wallets = [];
			return;
		}

		const list = [];
		for (const w of lodash.values(this.currentProfile.wallets)) {
			const wallet = new Wallet().deserialize(w);
			const isValidAddress = this.arkApiProvider.validateAddress(
				wallet.address,
			);
			if (isValidAddress) {
				list.push(wallet);
			}
		}

		this.totalBalance = lodash
			.chain(list)
			.sumBy((w) => parseInt(w.balance))
			.value();
		const wholeArk = this.totalBalance / constants.WALLET_UNIT_TO_SATOSHI;
		this.fiatBalance =
			wholeArk * (this.fiatCurrency ? this.fiatCurrency.price : 0);

		this.wallets = lodash.orderBy(list, ["lastUpdate"], ["desc"]);
		if (!this.selectedWallet && this.wallets.length) {
			this.selectedWallet = this.userDataService.getWalletByAddress(
				this.wallets[0].address,
			);
		}
	}

	private loadUserData() {
		this.currentNetwork = this.userDataService.currentNetwork;
		this.currentProfile = this.userDataService.currentProfile;
	}

	private onCreateUpdateWallet() {
		this.userDataService.onCreateWallet$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => this.loadWallets());
		this.userDataService.onUpdateWallet$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => this.loadWallets());
	}
}
