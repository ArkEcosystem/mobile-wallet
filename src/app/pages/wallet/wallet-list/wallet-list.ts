import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
	ActionSheetController,
	IonContent,
	IonSlides,
	ModalController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Network } from "ark-ts/model";
import lodash from "lodash";
import { BaseChartDirective } from "ng2-charts";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { GenerateEntropyModal } from "@/app/modals/generate-entropy/generate-entropy";
import { PinCodeModal } from "@/app/modals/pin-code/pin-code";
import { WalletBackupModal } from "@/app/modals/wallet-backup/wallet-backup";
import {
	MarketCurrency,
	MarketHistory,
	MarketTicker,
	Profile,
	Wallet,
} from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-wallet-list",
	templateUrl: "wallet-list.html",
	styleUrls: ["wallet-list.pcss"],
})
export class WalletListPage implements OnInit, OnDestroy {
	@ViewChild("walletSlider", { read: IonSlides })
	slider: IonSlides;

	@ViewChild("content", { read: IonContent, static: true })
	content: IonContent;

	@ViewChild(BaseChartDirective)
	chart: BaseChartDirective;

	public currentProfile: Profile;
	public currentNetwork: Network;
	public wallets: Wallet[] = [];
	public totalBalance: number;
	public fiatBalance: number;
	public selectedWallet: Wallet;

	public btcCurrency: MarketCurrency;
	public fiatCurrency: MarketCurrency;
	public marketTicker: MarketTicker;

	public slideOptions = {
		speed: 100,
		spaceBetween: -75,
	};
	public chartOptions: any;
	public chartLabels: any;
	public chartData: any;
	public chartColors: any = [
		{
			borderColor: "#394cf8",
		},
		{
			borderColor: "#f3a447",
		},
	];

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public navCtrl: NavController,
		private userDataService: UserDataService,
		private marketDataProvider: MarketDataProvider,
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private translateService: TranslateService,
		private settingsDataProvider: SettingsDataProvider,
		private ngZone: NgZone,
		private arkApiProvider: ArkApiProvider,
	) {}

	ngOnInit() {
		this.loadUserData();

		this.userDataService.clearCurrentWallet();
	}

	async onSlideChanged() {
		const realIndex = await this.slider.getActiveIndex();
		this.selectedWallet = this.userDataService.getWalletByAddress(
			this.wallets[realIndex].address,
		);
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
						this.slider.slideTo(0);
					});
			});
	}

	presentActionSheet() {
		this.translateService
			.get([
				"GENERATE",
				"WALLETS_PAGE.SCAN_QRCODE",
				"IMPORT_PASSPHRASE",
				"IMPORT_ADDRESS",
			])
			.subscribe(async (translation) => {
				const actionSheet = await this.actionSheetCtrl.create({
					buttons: [
						{
							text: translation.GENERATE,
							role: "generate",
							icon: "card",
							handler: () => {
								this.presentWalletGenerate();
							},
						},
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
		this.initMarketHistory();
		this.initTicker();

		// this.content.resize();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private async presentWalletGenerate() {
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

	private presentWalletImport(role: string) {
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

	private async storeWallet(account) {
		const wallet = new Wallet();
		wallet.address = account.address;
		wallet.publicKey = account.publicKey;

		const modal = await this.modalCtrl.create({
			component: PinCodeModal,
			componentProps: {
				message: "PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE",
				outputPassword: true,
				validatePassword: true,
			},
		});

		modal.onDidDismiss().then(({ data: password }) => {
			if (!password) {
				return;
			}

			this.userDataService
				.addWallet(wallet, account.mnemonic, password)
				.pipe(takeUntil(this.unsubscriber$))
				.subscribe(() => {
					this.loadWallets();
				});
		});

		modal.present();
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

	private initMarketHistory() {
		this.translateService
			.get([
				"WEEK_DAY.SUNDAY",
				"WEEK_DAY.MONDAY",
				"WEEK_DAY.TUESDAY",
				"WEEK_DAY.WEDNESDAY",
				"WEEK_DAY.THURSDAY",
				"WEEK_DAY.FRIDAY",
				"WEEK_DAY.SATURDAY",
			])
			.subscribe((translation) => {
				if (lodash.isEmpty(this.wallets)) {
					return;
				}

				const days = lodash.values(translation);

				this.settingsDataProvider.settings.subscribe((settings) => {
					if (this.marketDataProvider.cachedHistory) {
						this.setChartData(
							settings,
							days,
							this.marketDataProvider.cachedHistory,
						);
					}

					this.marketDataProvider.onUpdateHistory$
						.pipe(takeUntil(this.unsubscriber$))
						.subscribe((updatedHistory) =>
							this.setChartData(settings, days, updatedHistory),
						);
					this.marketDataProvider.fetchHistory().subscribe();
				});
			});
	}

	private setChartData = (
		settings: any,
		days: string[],
		history: MarketHistory,
	): void => {
		if (!history) {
			return;
		}

		const currency =
			!settings || !settings.currency
				? this.settingsDataProvider.getDefaults().currency
				: settings.currency;

		const fiatHistory = history.getLastWeekPrice(currency.toUpperCase());
		const btcHistory = history.getLastWeekPrice("BTC");

		this.chartLabels = null;

		this.chartData = [
			{
				yAxisID: "A",
				fill: false,
				data: fiatHistory.prices,
			},
			{
				yAxisID: "B",
				fill: false,
				data: btcHistory.prices,
			},
		];

		this.chartOptions = {
			legend: {
				display: false,
			},
			tooltips: {
				enabled: false,
			},
			scales: {
				xAxes: [
					{
						gridLines: {
							drawBorder: false,
							display: true,
							color: settings.darkMode ? "#12182d" : "#e1e4ea",
						},
						ticks: {
							fontColor: settings.darkMode
								? "#3a4566"
								: "#555459",
						},
					},
				],
				yAxes: [
					{
						gridLines: {
							drawBorder: false,
							display: true,
						},
						display: false,
						id: "A",
						type: "linear",
						position: "left",
						ticks: {
							max: Number(lodash.max(fiatHistory.prices)) * 1.1,
							min: Number(lodash.min(fiatHistory.prices)),
						},
					},
					{
						display: false,
						id: "B",
						type: "linear",
						position: "right",
						ticks: {
							max: Number(lodash.max(btcHistory.prices)) * 1.1,
							min: Number(lodash.min(btcHistory.prices)),
						},
					},
				],
			},
		};

		if (currency === "btc") {
			this.chartData[0].data = [];
		}

		this.ngZone.run(() => {
			this.chartLabels = lodash.map(
				fiatHistory.dates,
				(d: Date) => days[d.getDay()],
			);
			setTimeout(() => {
				if (this.chart) {
					this.chart.update();
				}
			}, 0);
		});
	};

	private setTicker(ticker) {
		this.marketTicker = ticker;
		this.btcCurrency = ticker.getCurrency({ code: "btc" });

		this.settingsDataProvider.settings.subscribe((settings) => {
			const currency =
				!settings || !settings.currency
					? this.settingsDataProvider.getDefaults().currency
					: settings.currency;

			this.fiatCurrency = ticker.getCurrency({ code: currency });
			this.loadWallets();
		});
	}

	private initTicker() {
		// just set the data from cache first
		if (this.marketDataProvider.cachedTicker) {
			this.setTicker(this.marketDataProvider.cachedTicker);
		}

		// now let's subscribe for any future changes
		this.marketDataProvider.onUpdateTicker$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((updatedTicker) => this.setTicker(updatedTicker));
		// let's get the up-to-date data from the internet now
		this.marketDataProvider.refreshTicker();
		// finally update the data in a regular interval
		setInterval(
			() => this.marketDataProvider.refreshTicker(),
			constants.WALLET_REFRESH_PRICE_MILLISECONDS,
		);
	}
}
