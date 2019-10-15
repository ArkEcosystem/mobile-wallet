import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TopWalletDetailsPage } from './top-wallet-details';
import {ClosePopupComponentModule} from '@/components/close-popup/close-popup.module';
import {QRCodeComponentModule} from '@/components/qr-code/qr-code.module';
import {PipesModule} from '@/pipes/pipes.module';
import {TranslateModule} from '@ngx-translate/core';
import {DirectivesModule} from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TopWalletDetailsPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ClosePopupComponentModule,
    QRCodeComponentModule,
    PipesModule,
    TranslateModule,
    DirectivesModule
  ],
  exports: [
    TopWalletDetailsPage
  ]
})
export class TopWalletDetailsPageModule {}
