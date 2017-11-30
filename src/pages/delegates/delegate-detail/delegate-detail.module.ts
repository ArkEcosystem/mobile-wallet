import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegateDetailPage } from './delegate-detail';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';
import { PipesModule } from '@pipes/pipes.module';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [
    DelegateDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegateDetailPage),
    TranslateModule,
    QRCodeModule,
    PipesModule,
    ClosePopupComponentModule,
  ],
})
export class DelegateDetailPageModule {}
