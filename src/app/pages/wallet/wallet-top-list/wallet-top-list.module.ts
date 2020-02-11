import { PipesModule } from "@/pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { TopWalletDetailsPage } from "./modal/top-wallet-details/top-wallet-details";
import { TopWalletDetailsPageModule } from "./modal/top-wallet-details/top-wallet-details.module";
import { WalletTopListPage } from "./wallet-top-list";

@NgModule({
	declarations: [WalletTopListPage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: WalletTopListPage }]),
		TranslateModule,
		PipesModule,
		TopWalletDetailsPageModule,
	],
	entryComponents: [TopWalletDetailsPage],
})
export class WalletTopListPageModule {}
