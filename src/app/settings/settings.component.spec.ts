import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	mockProvider,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";
import { of } from "rxjs";

import { AuthController } from "@/app/auth/shared/auth.controller";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { SettingsPage } from "./settings.component";
import { SettingsService } from "./shared/settings.service";
import { SettingsState } from "./shared/settings.state";

describe("Settings Component", () => {
	let spectator: SpectatorHost<SettingsPage>;
	const createHost = createHostComponentFactory({
		component: SettingsPage,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([SettingsState]),
			RouterModule.forRoot([]),
		],
		providers: [
			AuthController,
			mockProvider(UserDataService),
			mockProvider(SettingsService, {
				clear: () => of({}),
			}),
		],
	});

	it("should create", () => {
		spectator = createHost(`<settings-page></settings-page>`);
		const component = spectator.query(byTestId("c-settings-page"));
		expect(component).toBeTruthy();
	});
});
