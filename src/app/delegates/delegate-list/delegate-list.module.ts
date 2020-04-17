import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { DelegateListComponent } from "./delegate-list.component";

@NgModule({
	declarations: [DelegateListComponent],
	imports: [IonicModule, TranslateModule, IdenticonComponentModule],
	exports: [DelegateListComponent],
})
export class DelegateListComponentModule {}
