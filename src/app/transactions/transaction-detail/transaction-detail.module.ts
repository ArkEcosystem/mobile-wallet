import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { TransactionDetailComponent } from "./transaction-detail.component";

@NgModule({
	declarations: [TransactionDetailComponent],
	imports: [IonicModule, SharedModule, IdenticonComponentModule],
	exports: [TransactionDetailComponent],
	providers: [],
})
export class TransactionDetailModule {}
