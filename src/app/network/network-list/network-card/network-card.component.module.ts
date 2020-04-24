import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { NetworkCardComponent } from "./network-card.component";

@NgModule({
	declarations: [NetworkCardComponent],
	imports: [IonicModule, CommonModule],
	exports: [NetworkCardComponent],
})
export class NetworkCardComponentModule {}
