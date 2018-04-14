import { NgModule } from '@angular/core';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
import { MarketNetOnlyDirective } from './marketnet-only/marketnet-only';
import { HeaderScrollerDirective } from './header-scroller/header-scroller';
import { HideOnKeyboardOpenDirective } from './hide-on-keyboard-open/hide-on-keyboard-open';

@NgModule({
  declarations: [
    KeyboardAttachDirective,
    MarketNetOnlyDirective,
    HeaderScrollerDirective,
    HideOnKeyboardOpenDirective
  ],
  imports: [],
  exports: [
    KeyboardAttachDirective,
    MarketNetOnlyDirective,
    HeaderScrollerDirective,
    HideOnKeyboardOpenDirective
  ]
})
export class DirectivesModule {
}
