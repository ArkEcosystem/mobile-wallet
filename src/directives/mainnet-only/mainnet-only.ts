import { Directive, ElementRef, OnInit } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';
import { NetworkType } from 'ark-ts/model';

@Directive({
  selector: '[appMainnetOnly]'
})
export class MainnetOnlyDirective implements OnInit {
  constructor(
    private userDataProvider: UserDataProvider,
    private elementRef: ElementRef,
    // private renderer: Renderer
  ) {
  }

  ngOnInit() {
    if (this.userDataProvider.currentNetwork.type === NetworkType.Devnet) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
