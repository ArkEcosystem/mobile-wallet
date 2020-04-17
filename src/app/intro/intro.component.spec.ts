import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	createRoutingFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { of, Subject } from "rxjs";

import { AuthProvider } from "@/services/auth/auth";
import { StorageProvider } from "@/services/storage/storage";

import { IntroPage } from "./intro.component";
import { IntroService } from "./shared/intro.service";
import { IntroState } from "./shared/intro.state";
import { IntroStateModel } from "./shared/intro.type";

describe("IntroPage", () => {
	let spectator: Spectator<IntroPage>;
	let store: Store;

	const defaultState: IntroStateModel = {
		activeIndex: 0,
		isFinished: false,
	};

	const createComponent = createRoutingFactory({
		component: IntroPage,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([IntroState]),
			RouterModule.forRoot([]),
		],
		providers: [
			mockProvider(IntroService, {
				load: () => of(defaultState),
			}),
			mockProvider(StorageProvider, {
				get: () => of(defaultState),
			}),
			mockProvider(AuthProvider, {
				onLogin$: new Subject(),
				onLogout$: new Subject(),
			}),
		],
		routes: [
			{
				path: "",
				component: IntroPage,
			},
			{
				path: "/intro",
				component: IntroPage,
			},
		],
	});

	beforeEach(() => {
		spectator = createComponent();
		store = spectator.get(Store);
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	it("should update intro on startApp", () => {
		spectator.component.startApp();
		const authProvider = spectator.get(AuthProvider);
		authProvider.saveIntro.and.returnValue(of(true));

		const isFinished = store.selectSnapshot(IntroState.isFinished);
		expect(isFinished).toEqual(true);
	});

	it("should go to the next slide", async () => {
		spectator.component.goNext();
		const activeIndex = await spectator.component.slider.getActiveIndex();
		expect(activeIndex).toEqual(1);
	});

	it("should go to the end and update state", async () => {
		const slider = spectator.component.slider;
		slider.length = async () => 3;

		spectator.component.goNext();
		spectator.component.goNext();
		spectator.component.goNext();

		const activeIndex = await spectator.component.slider.getActiveIndex();
		const isEnd = await spectator.component.slider.isEnd();

		expect(activeIndex).toEqual(3);
		expect(isEnd).toEqual(true);
	});
});
