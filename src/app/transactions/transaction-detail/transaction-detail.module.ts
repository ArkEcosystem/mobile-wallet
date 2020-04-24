import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { TransactionPipe } from "../shared/transaction.pipe";
import { TransactionDetailComponent } from "./transaction-detail.component";

@NgModule({
	declarations: [TransactionDetailComponent, TransactionPipe],
	imports: [IonicModule, SharedModule, IdenticonComponentModule, PipesModule],
	exports: [TransactionDetailComponent],
})
export class TransactionDetailModule {}
