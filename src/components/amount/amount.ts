import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MarketCurrency } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { Network } from 'ark-ts/model';
import { Amount } from '@components/amount/amount.model';

@Component({
  selector: 'amount',
  templateUrl: 'amount.html'
})
export class AmountComponent implements OnInit {
  @Input()
  public formGroup: FormGroup = new FormGroup({amount: new FormControl(''), amountEquivalent: new FormControl('')});

  @Output()
  public onChange: EventEmitter<Amount> = new EventEmitter();

  public tokenPlaceholder = 100;
  public fiatPlaceholder: number;
  public amount: number;
  public amountEquivalent: number;
  public marketCurrency: MarketCurrency;
  public currentNetwork: Network;

  public constructor(userDataProvider: UserDataProvider,
                     private marketDataProvider: MarketDataProvider,
                     private settingsDataProvider: SettingsDataProvider,
                     private changeDetectorRef: ChangeDetectorRef) {
    this.currentNetwork = userDataProvider.currentNetwork;
  }

  public ngOnInit() {
    this.marketDataProvider.ticker.subscribe((ticker) => {
      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketCurrency = ticker.getCurrency({code: settings.currency});
        this.fiatPlaceholder = +(this.tokenPlaceholder * this.marketCurrency.price).toFixed(2);
      });
    });
  }

  public setAmount(amount: number) {
    this.amount = amount;
    this.onInputToken();
  }

  public onInputToken() {
    const precision = this.marketCurrency.code === 'btc' ? 8 : 2;
    this.amountEquivalent = +(this.amount * this.marketCurrency.price).toFixed(precision);
    this.hasChanged();
  }

  public onInputFiat() {
    this.amount = +(this.amountEquivalent / this.marketCurrency.price).toFixed(8);
    this.hasChanged();
  }

  private hasChanged() {
    this.changeDetectorRef.detectChanges();
    this.onChange.next({amount: this.amount, amountEquivalent: this.amountEquivalent} as Amount);
  }
}
