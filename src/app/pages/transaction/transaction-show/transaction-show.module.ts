import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransactionShowPage } from "./transaction-show";

import { PipesModule } from "@/pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

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
