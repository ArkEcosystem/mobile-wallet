import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { DirectivesModule } from "@/directives/directives.module";

import { ContactCreatePage } from "./contact-create";

@NgModule({
	declarations: [ContactCreatePage],
	imports: [
		IonicModule,
		SharedModule,
		RouterModule.forChild([{ path: "", component: ContactCreatePage }]),
		DirectivesModule,
		QRScannerComponentModule,
		InputAddressComponentModule,
	],
})
export class ContactCreatePageModule {}
