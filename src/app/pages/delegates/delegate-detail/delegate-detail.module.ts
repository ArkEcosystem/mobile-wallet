import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DelegateDetailPage } from './delegate-detail';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@/pipes/pipes.module';
import { ClosePopupComponentModule } from '@/components/close-popup/close-popup.module';
import { QRCodeComponentModule } from '@/components/qr-code/qr-code.module';
import { InputFeeComponentModule } from '@/components/input-fee/input-fee.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DelegateDetailPage,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    QRCodeComponentModule,
    PipesModule,
    ClosePopupComponentModule,
    InputFeeComponentModule,
  ],
  exports: [
    DelegateDetailPage
  ]
})
export class DelegateDetailPageModule {}
