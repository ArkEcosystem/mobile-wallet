import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransactionResponsePage } from "./transaction-response";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

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
