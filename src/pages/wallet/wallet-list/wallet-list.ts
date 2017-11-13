import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, Platform } from 'ionic-angular';

import { Chart } from 'chart.js';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

import { Profile, MarketCurrency, MarketTicker, MarketHistory, Wallet } from '@models/model';
import { Network } from 'ark-ts/model';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-wallet-list',
  templateUrl: 'wallet-list.html',
})
export class WalletListPage {
  @ViewChild('priceChart') priceChart: any;

  public currentProfile: Profile;
  public currentNetwork: Network;
  public wallets: Wallet[] = [];

  public btcCurrency: MarketCurrency;
  public fiatCurrency: MarketCurrency;
  public marketHistory: MarketHistory;
  public marketTicker: MarketTicker;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private marketDataProvider: MarketDataProvider,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private settingsDataProvider: SettingsDataProvider,
    private platform: Platform,
  ) {
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.currentProfile = this.userDataProvider.currentProfile;
  }

  openWalletDashboard(wallet: Wallet) {
    this.navCtrl.setRoot('WalletDashboardPage', {
      address: wallet.address
    });
  }

  presentActionSheet() {
    this.translateService.get([
      'GENERATE',
      'IMPORT',
      'CANCEL',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation.GENERATE,
            role: 'generate',
            icon: !this.platform.is('ios') ? 'card' : null,
            handler: () => {
              this.presentWalletGenerate();
            }
          }, {
            text: translation.IMPORT,
            role: 'import',
            icon: !this.platform.is('ios') ? 'sync' : null,
            handler: () => {
              this.presentWalletImport();
            }
          }, {
            text: translation.CANCEL,
            icon: !this.platform.is('ios') ? 'close' : null,
            role: 'cancel'
          }
        ]
      });

      actionSheet.present();
    });
  }

  private presentWalletGenerate() {
    let modal = this.modalCtrl.create('GenerateEntropyPage');

    modal.onDidDismiss((entropy) => {
      if (!entropy) return;

      let showModal = this.modalCtrl.create('WalletCreatePage', {
        entropy,
      });

      showModal.onDidDismiss((account) => {
        if (!account) return;

        this.storeWallet(account);
      });


      showModal.present();
    })

    modal.present();
  }

  private presentWalletImport() {
    this.navCtrl.push('WalletImportPage');
  }

  private storeWallet(account) {
    let wallet = new Wallet();
    wallet.address = account.address;
    wallet.publicKey = account.publicKey;

    let modal = this.modalCtrl.create('PinCodePage', {
      message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
      outputPassword: true,
      validatePassword: true
    });

    modal.onDidDismiss((password) => {
      if (!password) return;

      this.userDataProvider.addWallet(wallet, account.mnemonic, password).takeUntil(this.unsubscriber$).subscribe((response) => {
        this.loadWallets();
      });
    })

    modal.present();
  }

  private loadWallets() {
    if (lodash.isEmpty(this.currentProfile.wallets)) return;

    let list = [];
    for (let w of lodash.values(this.currentProfile.wallets)) {
      let wallet = new Wallet().deserialize(w);
      list.push(wallet);
    }

    this.wallets = lodash.orderBy(list, ['lastUpdate'], ['desc']);
  }

  private onUpdateWallet() {
    this.userDataProvider.onUpdateWallet$
      .takeUntil(this.unsubscriber$)
      .subscribe(() => this.loadWallets());
  }

  private setMarketHistory() {
    this.translateService.get([
      'WEEK_DAY.SUNDAY',
      'WEEK_DAY.MONDAY',
      'WEEK_DAY.TUESDAY',
      'WEEK_DAY.WEDNESDAY',
      'WEEK_DAY.THURSDAY',
      'WEEK_DAY.FRIDAY',
      'WEEK_DAY.SATURDAY',
    ]).subscribe((translation) => {
      let days = lodash.values(translation);

      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketDataProvider.history.takeUntil(this.unsubscriber$).subscribe((history) => {
          if (!history) return;

          let currency = settings.currency == 'btc' ? this.settingsDataProvider.getDefaults().currency : settings.currency;

          let fiatHistory = history.getLastWeekPrice(currency);
          let btcHistory = history.getLastWeekPrice('btc');

          this.priceChart = new Chart(this.priceChart.nativeElement, {
            type: 'line',
            options: {
              maintainAspectRatio: false,
              response: true,
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
              scales: {
                xAxes: [{
                  gridLines: {
                    display: false,
                  }
                }],
                yAxes: [{
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
            },
            data: {
              labels: lodash.map(fiatHistory.dates, (d: Date) => days[d.getDay()]),
              datasets: [{
                yAxisID : "A",
                fill: false,
                borderColor: '#394cf8',
                data: fiatHistory.prices,
              }, {
                yAxisID : "B",
                fill: false,
                borderColor: '#f3a447',
                data: btcHistory.prices,
              }],
            }
          });
        });
      });
    });
  }

  private setTicker(ticker) {
    this.marketTicker = ticker;
    this.btcCurrency = ticker.getCurrency({ code: 'btc' });

    this.settingsDataProvider.settings.subscribe((settings) => {
      let currency = settings.currency == 'btc' ? this.settingsDataProvider.getDefaults().currency : settings.currency;

      this.fiatCurrency = ticker.getCurrency({ code: currency });
    });
  }

  ionViewDidLoad() {
    this.loadWallets();
    this.onUpdateWallet();
    this.setMarketHistory();

    // Fetch from api or get from storage
    this.marketDataProvider.ticker.subscribe((ticker) => this.setTicker(ticker));

    // On refresh price
    this.marketDataProvider.onUpdateTicker$.takeUntil(this.unsubscriber$).subscribe((ticker) => this.setTicker(ticker));

    // wait 5sec to refresh the price
    setTimeout(() => this.marketDataProvider.refreshPrice(), 5000);

    // Fetch from api or get from storage
    this.marketDataProvider.fetchHistory().subscribe((history) => {
      this.marketHistory = history
    }, () => this.marketDataProvider.history.subscribe((history) => this.marketHistory = history));
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
