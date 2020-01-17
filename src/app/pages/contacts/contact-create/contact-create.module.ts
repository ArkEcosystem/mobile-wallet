import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ContactCreatePage } from "./contact-create";

import { DirectivesModule } from "@/directives/directives.module";
import { TranslateModule } from "@ngx-translate/core";

import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [ContactCreatePage],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: ContactCreatePage }]),
		TranslateModule,
		DirectivesModule,
		QRScannerComponentModule,
	],
})
export class ContactCreatePageModule {}
