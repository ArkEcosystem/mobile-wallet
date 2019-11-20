import { Component, OnDestroy, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Platform, IonSlides, IonContent } from '@ionic/angular';

import { Subject } from 'rxjs';

import { UserDataProvider } from '@/services/user-data/user-data';
import { MarketDataProvider } from '@/services/market-data/market-data';
import { SettingsDataProvider } from '@/services/settings-data/settings-data';

import { Profile, MarketCurrency, MarketTicker, MarketHistory, Wallet } from '@/models/model';
import { PublicKey } from 'ark-ts/core';
import { Network } from 'ark-ts/model';

import { TranslateService } from '@ngx-translate/core';

import * as constants from '@/app/app.constants';
import lodash from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { GenerateEntropyModal } from '@/app/modals/generate-entropy/generate-entropy';
import { WalletBackupModal } from '@/app/modals/wallet-backup/wallet-backup';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'page-wallet-list',
  templateUrl: 'wallet-list.html',
  styleUrls: ['wallet-list.scss'],
})
export class WalletListPage implements OnInit, OnDestroy {
  @ViewChild('walletSlider', { read: IonSlides, static: false })
  slider: IonSlides;

  @ViewChild('content', { read: IonContent, static: true })
  content: IonContent;

  @ViewChild(BaseChartDirective, { static: false })
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

  public chartOptions: any;
  public chartLabels: any;
  public chartData: any;
  public chartColors: any = [{
    borderColor: '#394cf8'
  }, {
    borderColor: '#f3a447'
  }];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    private userDataProvider: UserDataProvider,
    private marketDataProvider: MarketDataProvider,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private settingsDataProvider: SettingsDataProvider,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    this.loadUserData();

    this.userDataProvider.clearCurrentWallet();
  }

  async onSlideChanged() {
    const realIndex = await this.slider.getActiveIndex();
    this.selectedWallet = this.userDataProvider.getWalletByAddress(this.wallets[realIndex].address);
  }

  openWalletDashboard(wallet: Wallet) {
    this.navCtrl.navigateForward('/wallets/dashboard', {
      queryParams: {
        address: wallet.address
      }
    }).then(() => {
      this.userDataProvider.updateWallet(wallet, this.currentProfile.profileId).subscribe(() => {
        this.loadWallets();
        this.slider.slideTo(0);
      });
    });
  }

  presentActionSheet() {
    this.translateService.get([
      'GENERATE',
      'IMPORT',
    ]).subscribe(async (translation) => {
      const actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation.GENERATE,
            role: 'generate',
            icon: this.platform.is('ios') ? 'ios-card-outline' : 'md-card',
            handler: () => {
              this.presentWalletGenerate();
            }
          }, {
            text: translation.IMPORT,
            role: 'import',
            icon: this.platform.is('ios') ? 'ios-cloud-upload-outline' : 'md-cloud-upload',
            handler: () => {
              this.presentWalletImport();
            }
          }
        ]
      });

      actionSheet.present();
    });
  }

  private async presentWalletGenerate() {
    const modal = await this.modalCtrl.create({
      component: GenerateEntropyModal
    });

    modal.onDidDismiss().then(async ({ data: entropy }) => {
      if (!entropy) { return; }

      const showModal = await this.modalCtrl.create({
        component: WalletBackupModal,
        componentProps: {
          title: 'WALLETS_PAGE.CREATE_WALLET',
          entropy,
        }
      });

      showModal.onDidDismiss().then((account) => {
        if (!account) { return; }

        this.storeWallet(account);
      });


      showModal.present();
    });

    modal.present();
  }

  private presentWalletImport() {
    this.navCtrl.navigateForward('/wallets/import');
  }

  private async storeWallet(account) {
    const wallet = new Wallet();
    wallet.address = account.address;
    wallet.publicKey = account.publicKey;

    const modal = await this.modalCtrl.create({
      component: PinCodeModal,
      componentProps: {
        message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
        outputPassword: true,
        validatePassword: true
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data.password) { return; }

      this.userDataProvider.addWallet(wallet, account.mnemonic, data.password).pipe(
        takeUntil(this.unsubscriber$)
      ).subscribe(() => {
        this.loadWallets();
      });
    });

    modal.present();
  }

  private loadWallets() {
    this.loadUserData();
    if (!this.currentProfile || lodash.isEmpty(this.currentProfile.wallets)) { return; }

    const list = [];
    for (const w of lodash.values(this.currentProfile.wallets)) {
      const wallet = new Wallet().deserialize(w);
      if (PublicKey.validateAddress(wallet.address, this.currentNetwork)) {
        list.push(wallet);
      }
    }

    this.totalBalance = lodash.chain(list).sumBy((w) => parseInt(w.balance)).value();
    const wholeArk = (this.totalBalance / constants.WALLET_UNIT_TO_SATOSHI);
    this.fiatBalance = wholeArk * (this.fiatCurrency ? this.fiatCurrency.price : 0);

    this.wallets = lodash.orderBy(list, ['lastUpdate'], ['desc']);
    if (!this.selectedWallet && this.wallets.length) {
      this.selectedWallet = this.userDataProvider.getWalletByAddress(this.wallets[0].address);
    }
  }

  private loadUserData() {
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.currentProfile = this.userDataProvider.currentProfile;
  }

  private onCreateUpdateWallet() {
    this.userDataProvider.onCreateWallet$
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => this.loadWallets());
    this.userDataProvider.onUpdateWallet$
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => this.loadWallets());
  }

  private initMarketHistory() {
    this.translateService.get([
      'WEEK_DAY.SUNDAY',
      'WEEK_DAY.MONDAY',
      'WEEK_DAY.TUESDAY',
      'WEEK_DAY.WEDNESDAY',
      'WEEK_DAY.THURSDAY',
      'WEEK_DAY.FRIDAY',
      'WEEK_DAY.SATURDAY',
    ]).subscribe((translation) => {
      if (lodash.isEmpty(this.wallets)) { return; }

      const days = lodash.values(translation);

      this.settingsDataProvider.settings.subscribe((settings) => {
        if (this.marketDataProvider.cachedHistory) {
          this.setChartData(settings, days, this.marketDataProvider.cachedHistory);
        }

        this.marketDataProvider
          .onUpdateHistory$
          .pipe(
            takeUntil(this.unsubscriber$)
          )
          .subscribe((updatedHistory) => this.setChartData(settings, days, updatedHistory));
        this.marketDataProvider.fetchHistory().subscribe();
      });
    });
  }

  private setChartData = (settings: any, days: string[], history: MarketHistory): void => {
    if (!history) {
      return;
    }

    const currency = (!settings || !settings.currency) ? this.settingsDataProvider.getDefaults().currency : settings.currency;

    const fiatHistory = history.getLastWeekPrice(currency.toUpperCase());
    const btcHistory = history.getLastWeekPrice('BTC');

    this.chartLabels = null;

    this.chartData = [{
      yAxisID: 'A',
      fill: false,
      data: fiatHistory.prices,
    }, {
      yAxisID: 'B',
      fill: false,
      data: btcHistory.prices,
    }];

    this.chartOptions = {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            display: true,
            color: settings.darkMode ? '#12182d' : '#e1e4ea',
          },
          ticks: {
            fontColor: settings.darkMode ? '#3a4566' : '#555459'
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false,
            display: true,
          },
          display: false,
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            max: Number(lodash.max(fiatHistory.prices)) * 1.1,
            min: Number(lodash.min(fiatHistory.prices))
          }
        }, {
          display: false,
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            max: Number(lodash.max(btcHistory.prices)) * 1.1,
            min: Number(lodash.min(btcHistory.prices)),
          }
        }]
      }
    };

    if (currency === 'btc') {
      this.chartData[0].data = [];
    }

    this.ngZone.run(() => {
      this.chartLabels = lodash.map(fiatHistory.dates, (d: Date) => days[d.getDay()]);
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      }, 0);
    });
  };

  private setTicker(ticker) {
    this.marketTicker = ticker;
    this.btcCurrency = ticker.getCurrency({ code: 'btc' });

    this.settingsDataProvider.settings.subscribe((settings) => {
      const currency = (!settings || !settings.currency) ? this.settingsDataProvider.getDefaults().currency : settings.currency;

      this.fiatCurrency = ticker.getCurrency({ code: currency });
      this.loadWallets();
    });
  }

  ngOnInit() {
    this.loadWallets();
    this.onCreateUpdateWallet();
    this.initMarketHistory();
    this.initTicker();

    // this.content.resize();
  }

  private initTicker() {
    // just set the data from cache first
    if (this.marketDataProvider.cachedTicker) {
      this.setTicker(this.marketDataProvider.cachedTicker);
    }

    // now let's subscribe for any future changes
    this.marketDataProvider
      .onUpdateTicker$
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((updatedTicker) => this.setTicker(updatedTicker));
    // let's get the up-to-date data from the internet now
    this.marketDataProvider.refreshTicker();
    // finally update the data in a regular interval
    setInterval(() => this.marketDataProvider.refreshTicker(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
