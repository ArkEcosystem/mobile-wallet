import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegateDetailPage } from './delegate-detail';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';
import { QRCodeComponentModule } from '@components/qr-code/qr-code.module';

@NgModule({
  declarations: [
    DelegateDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegateDetailPage),
    TranslateModule,
    QRCodeComponentModule,
    PipesModule,
    ClosePopupComponentModule,
  ],
})
export class DelegateDetailPageModule {}
