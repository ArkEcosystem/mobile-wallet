import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { IntroPage } from "./intro";

import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [IntroPage],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: "", component: IntroPage }]),
    TranslateModule
  ]
})
export class IntroPageModule {}
