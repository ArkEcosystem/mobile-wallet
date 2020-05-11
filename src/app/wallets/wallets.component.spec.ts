import {
	ActionSheetController,
	IonicModule,
	NavController,
} from "@ionic/angular";
import {
	byTestId,
	createHostFactory,
	createSpyObject,
	mockProvider,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { UserDataProviderMock } from "@@/test/mocks";
import { AuthController } from "@/app/auth/shared/auth.controller";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { UserDataService } from "@/services/user-data/user-data.interface";
import ApiClient from "@/utils/ark-client";

import { WalletsEmptyListComponentModule } from "./wallets-empty-list/wallets-empty-list.module";
import { WalletsComponent } from "./wallets.component";

describe("Wallets Component", () => {
	let spectator: SpectatorHost<WalletsComponent>;

	const apiClient = createSpyObject(ApiClient);

	const createHost = createHostFactory({
		component: WalletsComponent,
		mocks: [AuthController, NavController, ActionSheetController],
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			WalletsEmptyListComponentModule,
		],
		providers: [
			{ provide: UserDataService, useClass: UserDataProviderMock },
			mockProvider(MarketDataProvider),
			mockProvider(SettingsDataProvider),
			mockProvider(ArkApiProvider, {
				client: apiClient,
			}),
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><wallets-component></wallets-component></ion-content>`,
		);
		expect(spectator.component).toBeTruthy();
	});

	it("should render the empty list", () => {
		spectator = createHost(
			`<ion-content><wallets-component></wallets-component></ion-content>`,
		);

		expect(spectator.query(byTestId("c-wallets__empty-list"))).toBeTruthy();
	});
});
