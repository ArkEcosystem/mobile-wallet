import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AmountComponent } from '@components/amount/amount';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [AmountComponent],
  imports: [IonicModule,
    DirectivesModule
  ],
  exports: [AmountComponent]
})
export class AmountComponentModule { }
