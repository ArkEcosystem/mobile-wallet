import { NgModule } from '@angular/core';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
import { MainnetOnlyDirective } from './mainnet-only/mainnet-only';
import { HeaderScrollerDirective } from './header-scroller/header-scroller';

@NgModule({
	declarations: [KeyboardAttachDirective, MainnetOnlyDirective, HeaderScrollerDirective],
	imports: [],
	exports: [KeyboardAttachDirective, MainnetOnlyDirective, HeaderScrollerDirective]
})
export class DirectivesModule {}
