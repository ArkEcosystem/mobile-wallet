import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ProfileSigninPage } from "./profile-signin";

import { AddressListComponentModule } from "@/components/address-list/address-list.module";
import { EmptyListComponentModule } from "@/components/empty-list/empty-list.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [ProfileSigninPage],
	imports: [
		CommonModule,
		EmptyListComponentModule,
		TranslateModule,
		IonicModule,
		RouterModule.forChild([{ path: "", component: ProfileSigninPage }]),
		AddressListComponentModule,
		PinCodeComponentModule,
	],
})
export class ProfileSigninPageModule {}
