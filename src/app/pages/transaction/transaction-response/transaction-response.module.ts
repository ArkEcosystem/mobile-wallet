import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { TransactionResponsePage } from "./transaction-response";

@NgModule({
	declarations: [TransactionResponsePage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([
			{ path: "", component: TransactionResponsePage },
		]),
		TranslateModule,
	],
})
export class TransactionResponsePageModule {}
