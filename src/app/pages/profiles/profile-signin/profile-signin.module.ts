import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { AddressListComponentModule } from "@/components/address-list/address-list.module";
import { EmptyListComponentModule } from "@/components/empty-list/empty-list.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";

import { ProfileSigninPage } from "./profile-signin";

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
