import { NgModule } from '@angular/core';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
import { MainnetOnlyDirective } from './mainnet-only/mainnet-only';
import { HeaderScrollerDirective } from './header-scroller/header-scroller';
import { HideOnKeyboardOpenDirective } from './hide-on-keyboard-open/hide-on-keyboard-open';

@NgModule({
  declarations: [KeyboardAttachDirective, MainnetOnlyDirective, HeaderScrollerDirective, HideOnKeyboardOpenDirective],
  imports: [],
  exports: [KeyboardAttachDirective, MainnetOnlyDirective, HeaderScrollerDirective, HideOnKeyboardOpenDirective]
})
export class DirectivesModule {}
