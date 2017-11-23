import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegatesPage } from './delegates';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { PinCodeComponentModule } from '@components/pin-code/pin-code.module';

@NgModule({
  declarations: [
    DelegatesPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegatesPage),
    TranslateModule,
    PipesModule,
    FilterPipeModule,
    PinCodeComponentModule,
  ],
})
export class DelegatesPageModule {}
