import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletCreatePage } from './wallet-create';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletCreatePage),
    TranslateModule,
    QRCodeModule,
    PipesModule,
  ],
})
export class WalletCreatePageModule {}
