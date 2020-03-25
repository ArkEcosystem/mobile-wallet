import { IonicModule, NavController } from "@ionic/angular";
import { byTestId, createComponentFactory, Spectator } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";
import { AuthProvider } from "@/services/auth/auth";

import { IntroPage } from "./intro";

describe("Intro Page", () => {
	let spectator: Spectator<IntroPage>;
	const createComponent = createComponentFactory({
		component: IntroPage,
		declarations: [IntroPage],
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
		mocks: [AuthProvider, NavController],
	});

	beforeAll(() => removeLogs());

	beforeEach(async () => {
		spectator = createComponent();
		// Wait for Ionic
		await sleep(100);
	});

	it("should skip to the login screen", async () => {
		const authProvider = spectator.get(AuthProvider);
		const navCtrl = spectator.get(NavController);
		authProvider.saveIntro.and.returnValue(of(true));
		const next = spectator.query(byTestId("c-intro__skip"));
		spectator.click(next);
		expect(navCtrl.navigateForward).toHaveBeenCalledWith(
			"/login",
			jasmine.anything(),
		);
	});

	it("should activate the 2nd slide", async () => {
		const next = spectator.query(byTestId("c-intro__next"));
		spectator.click(next);
		await sleep(500);
		spectator.detectChanges();
		const slides = spectator.queryAll(byTestId("c-intro__slides__slide"));
		const paginations = spectator.queryAll(
			byTestId("c-intro__pagination__page"),
		);
		expect(slides[1]).toHaveClass("swiper-slide-active");
		expect(paginations[1]).toHaveClass("active");
	});

	it("should hide the next button when it reaches the last slide", async () => {
		const next = spectator.query(byTestId("c-intro__next"));
		spectator.click(next);
		spectator.detectChanges();
		spectator.click(next);
		await sleep(500);
		spectator.detectChanges();
		const doneButton = spectator.query(byTestId("c-intro__done"));
		const skipButton = spectator.query(byTestId("c-intro__skip"));
		await sleep(100);
		expect(next).not.toBeVisible();
		expect(doneButton).toBeVisible();
		expect(skipButton.hasAttribute("disabled")).toBeTrue();
	});
});
