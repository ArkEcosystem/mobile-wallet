import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { RecipientListResumeComponent } from "./recipient-list-resume.component";

@NgModule({
	declarations: [RecipientListResumeComponent],
	imports: [IonicModule, CommonModule, IdenticonComponentModule],
	exports: [RecipientListResumeComponent],
})
export class RecipientListResumeComponentModule {}
