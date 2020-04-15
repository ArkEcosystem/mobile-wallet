import { IonicModule } from "@ionic/angular";
import {
	createComponentFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

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

	const createComponent = createComponentFactory({
		component: IntroPage,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([IntroState]),
		],
		providers: [
			mockProvider(IntroService, {
				load: () => of(defaultState),
			}),
		],
	});

	beforeEach(() => {
		spectator = createComponent();
		store = spectator.get(Store);
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});
});
