import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponentModule } from "../transaction-row/transaction-row.component.module";
import { TransactionListComponent } from "./transaction-list.component";

@NgModule({
	declarations: [TransactionListComponent],
	imports: [
		IonicModule,
		CommonModule,
		PipesModule,
		TransactionRowComponentModule,
	],
	exports: [TransactionListComponent],
})
export class TransactionListComponentModule {}
