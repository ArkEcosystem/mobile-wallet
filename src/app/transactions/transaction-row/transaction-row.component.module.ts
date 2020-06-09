import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { TransactionRowComponent } from "./transaction-row.component";

@NgModule({
	declarations: [TransactionRowComponent],
	imports: [IonicModule, CommonModule, PipesModule],
	exports: [TransactionRowComponent],
})
export class TransactionRowComponentModule {}
