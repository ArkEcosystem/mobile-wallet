import { Directive, ElementRef, OnInit } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';

@Directive({
  selector: '[appMarketNetOnly]'
})
export class MarketNetOnlyDirective implements OnInit {
  constructor(
    private userDataProvider: UserDataProvider,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (!this.userDataProvider.currentNetwork.marketTickerName
        && !this.userDataProvider.isMainNet) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
