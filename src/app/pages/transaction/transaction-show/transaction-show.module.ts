import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionShowPage } from "./transaction-show";

@NgModule({
	declarations: [TransactionShowPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: TransactionShowPage }]),
		TranslateModule,
		PipesModule,
		DirectivesModule,
	],
})
export class TransactionShowPageModule {}
