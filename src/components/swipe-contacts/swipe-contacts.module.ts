import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SwipeContactsComponent } from './swipe-contacts';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SwipeContactsComponent],
  imports: [IonicModule, TranslateModule],
  exports: [SwipeContactsComponent]
})
export class SwipeContactsComponentModule { }
