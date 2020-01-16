import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IntroPage } from "./intro";

import { RouterModule } from "@angular/router";
import { SharedModule } from '@/app/shared.module';

@NgModule({
  declarations: [IntroPage],
  imports: [
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: "", component: IntroPage }]),
  ],
})
export class IntroPageModule {}
