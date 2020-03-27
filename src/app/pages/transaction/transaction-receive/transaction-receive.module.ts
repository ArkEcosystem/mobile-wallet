import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { InputAmountComponentModule } from "@/components/input-amount/input-amount.module";
import { QRCodeComponentModule } from "@/components/qr-code/qr-code.module";

import { TransactionReceivePage } from "./transaction-receive";

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
