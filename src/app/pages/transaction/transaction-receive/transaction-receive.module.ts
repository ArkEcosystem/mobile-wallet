import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransactionReceivePage } from "./transaction-receive";

import { AmountComponentModule } from "@/components/amount/amount.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [TransactionReceivePage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([
			{ path: "", component: TransactionReceivePage },
		]),
		TranslateModule,
		AmountComponentModule,
		QRCodeComponentModule,
	],
})
export class WalletReceivePageModule {}
