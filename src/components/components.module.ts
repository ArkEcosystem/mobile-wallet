import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { EmptyListComponentModule } from './empty-list/empty-list.module';
import { PinCodeComponentModule } from './pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@components/confirm-transaction/confirm-transaction.module';
import { ClosePopupComponentModule } from './close-popup/close-popup.module';
import { AddressListComponentModule } from './address-list/address-list.module';

@NgModule({
  declarations: [
    ProgressBarComponent,
  ],
  imports: [],
  exports: [
    ProgressBarComponent,
    EmptyListComponentModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    ClosePopupComponentModule,
    AddressListComponentModule,
  ]
})
export class ComponentsModule {}
