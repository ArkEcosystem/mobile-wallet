import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListComponent } from "./recipient-list.component";

@NgModule({
	declarations: [RecipientListComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		IdenticonComponentModule,
		PipesModule,
	],
	exports: [RecipientListComponent],
})
export class RecipientListComponentModule {}
