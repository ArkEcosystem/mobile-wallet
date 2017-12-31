import { Directive, ElementRef, OnInit } from '@angular/core';
import { UserDataProvider } from '@providers/user-data/user-data';

@Directive({
  selector: '[appMainnetOnly]'
})
export class MainnetOnlyDirective implements OnInit {
  constructor(
    private userDataProvider: UserDataProvider,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (this.userDataProvider.isDevNet) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
