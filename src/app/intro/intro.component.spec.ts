import { RouterModule } from "@angular/router";
import { IonicModule, NavController } from "@ionic/angular";
import {
	byTestId,
	createRoutingFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";

import { IntroPage } from "./intro.component";
import { IntroService } from "./shared/intro.service";
import { IntroState } from "./shared/intro.state";

describe("IntroPage", () => {
	let spectator: Spectator<IntroPage>;

	const createComponent = createRoutingFactory({
		component: IntroPage,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([IntroState]),
			RouterModule.forRoot([]),
		],
		mocks: [NavController],
		providers: [
			mockProvider(IntroService, {
				load: () => of(undefined),
			}),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => {
		spectator = createComponent();
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	it("should render slides", async () => {
		await sleep(100);
		const slides = spectator.queryAll(byTestId("intro__slide"));
		const image = spectator.query(byTestId("intro__slide__image"));
		const title = spectator.query(byTestId("intro__slide__title"));
		const description = spectator.query(
			byTestId("intro__slide__description"),
		);
		expect(slides.length).toBeGreaterThan(1);
		expect(image).toBeVisible();
		expect(title).toBeVisible();
		expect(description).toBeVisible();
	});

	it("should show buttons", async () => {
		await sleep(100);
		const skip = spectator.queryAll(byTestId("intro__skip"));
		const next = spectator.queryAll(byTestId("intro__next"));
		expect(skip).toBeVisible();
		expect(next).toBeVisible();
	});

	it("should go to the next slide", async () => {
		await sleep(100);
		const next = spectator.query(byTestId("intro__next"));
		spectator.click(next);
		await sleep(100);
		const slides = spectator.queryAll(byTestId("intro__slide"));
		expect(slides[1]).toHaveClass("swiper-slide-active");
	});

	it("should show the done button and end", async () => {
		await sleep(100);
		const next = spectator.query(byTestId("intro__next"));
		spectator.click(next);
		spectator.detectChanges();
		spectator.click(next);
		await sleep(500);
		spectator.detectChanges();

		const done = spectator.query(byTestId("intro__done"));
		expect(done).toBeVisible();

		const navCtrl = spectator.get(NavController);
		navCtrl.navigateRoot.and.callFake(() => {});
		spectator.click(done);
		expect(navCtrl.navigateRoot).toHaveBeenCalled();
	});
});
