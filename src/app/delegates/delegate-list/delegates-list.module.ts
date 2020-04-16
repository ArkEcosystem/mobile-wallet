import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { DelegatesListComponent } from "./delegates-list.component";

@NgModule({
	declarations: [DelegatesListComponent],
	imports: [IonicModule, TranslateModule, IdenticonComponentModule],
	exports: [DelegatesListComponent],
})
export class DelegatesListComponentModule {}
