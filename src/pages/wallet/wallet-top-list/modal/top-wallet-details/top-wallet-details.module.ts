import { NgModule } from '@root/node_modules/@angular/core';
import { IonicPageModule } from '@root/node_modules/ionic-angular';
import { TopWalletDetailsPage } from './top-wallet-details';
import {ClosePopupComponentModule} from '@components/close-popup/close-popup.module';
import {QRCodeComponentModule} from '@components/qr-code/qr-code.module';
import {PipesModule} from '@pipes/pipes.module';
import {TranslateModule} from '@root/node_modules/@ngx-translate/core';
import {DirectivesModule} from '@directives/directives.module';

@NgModule({
  declarations: [
    TopWalletDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TopWalletDetailsPage),
    ClosePopupComponentModule,
    QRCodeComponentModule,
    PipesModule,
    TranslateModule,
    DirectivesModule
  ],
})
export class TopWalletDetailsPageModule {}
