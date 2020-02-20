import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TransactionReceivePage } from "./transaction-receive";

import { InputAmountComponentModule } from "@/components/input-amount/input-amount.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [TransactionReceivePage],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{ path: "", component: TransactionReceivePage },
		]),
		TranslateModule,
		InputAmountComponentModule,
		QRCodeComponentModule,
	],
})
export class WalletReceivePageModule {}
