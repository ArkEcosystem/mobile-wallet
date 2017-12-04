import { NgModule } from '@angular/core';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
import { MainnetOnlyDirective } from './mainnet-only/mainnet-only';

@NgModule({
	declarations: [KeyboardAttachDirective, MainnetOnlyDirective],
	imports: [],
	exports: [KeyboardAttachDirective, MainnetOnlyDirective]
})
export class DirectivesModule {}
