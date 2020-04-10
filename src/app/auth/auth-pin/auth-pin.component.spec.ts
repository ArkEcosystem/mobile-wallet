import { AlertController, IonicModule } from "@ionic/angular";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { Store } from "@ngxs/store";

import { removeLogs } from "@@/test/helpers";
import { PipesModule } from "@/pipes/pipes.module";

import { AuthService } from "../auth.service";
import { AuthPinComponent } from "./auth-pin.component";

xdescribe("Auth Pin Component", () => {
	let spectator: SpectatorHost<AuthPinComponent>;
	const createHost = createHostFactory({
		component: AuthPinComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			PipesModule,
		],
		mocks: [AuthService, AlertController, Store, AuthService],
	});

	beforeAll(() => removeLogs());
});
