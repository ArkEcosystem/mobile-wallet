import { IonicModule, NavController } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { render } from "@testing-library/angular";
import { Observable } from "rxjs";

import { AuthProvider } from "@/services/auth/auth";

import { IntroPage } from "./intro";

const navCtrlSpy = jasmine.createSpyObj("NavController", ["navigateForward"]);
const authProviderSpy = jasmine.createSpyObj("AuthProvider", {
	saveIntro: new Observable(),
});

function createComponent(props?: Partial<IntroPage>) {
	return render(IntroPage, {
		imports: [
			IonicModule,
			IonicStorageModule.forRoot(),
			TranslateModule.forRoot(),
		],
		providers: [
			{ provide: NavController, useValue: navCtrlSpy },
			{ provide: AuthProvider, useValue: authProviderSpy },
		],
	});
}

describe("Intro Page", () => {
	it("should create", async () => {
		const component = await createComponent();
		expect(component).toBeTruthy();
	});

	it("should be visible the skip button", async () => {
		const component = await createComponent();
		const skipBtn = component.queryByTestId("c-intro__skip");
		expect(skipBtn).toBeTruthy();
	});

	it("should be visible the next button", async () => {
		const component = await createComponent();
		const nextBtn = component.queryByTestId("c-intro__next");
		expect(nextBtn).toBeTruthy();
	});

	it("should be hidden the done button", async () => {
		const component = await createComponent();

		expect(component.queryByTestId("c-intro__done")).toBeFalsy();
	});

	it("should contain the slides", async () => {
		const component = await createComponent();
		const elements = component.queryAllByTestId("c-intro__slides__slide");
		expect(elements.length).toBeGreaterThan(0);
		expect(elements.length).toBe(
			component.fixture.componentInstance.slides.length,
		);
	});

	/**
	 * NOTE: The Ionic Slides relies on Swiper methods
	 * but their instance is not available in the test environment
	 * then I faked the methods to mimic the behavior
	 */
	it("should activate the 2nd slide by clicking the next button", async done => {
		const component = await createComponent();
		const instance = component.fixture.componentInstance;
		const slider = instance.slider;
		spyOn(slider, "slideNext").and.callFake(() => {
			instance.onSlideChanged();
			return Promise.resolve();
		});
		spyOn(slider, "isEnd").and.returnValue(Promise.resolve(false));
		spyOn(slider, "getActiveIndex").and.returnValue(Promise.resolve(1));
		spyOn(slider, "length").and.returnValue(
			Promise.resolve(instance.slides.length),
		);

		component.click(component.queryByTestId("c-intro__next"));
		expect(slider.slideNext).toHaveBeenCalled();
		setTimeout(() => {
			expect(instance.activeIndex).toBe(1);
			done();
		}, 100);
	});

	it("should start the app", async () => {
		const component = await createComponent();
		spyOn(
			component.fixture.componentInstance,
			"startApp",
		).and.callThrough();
		component.click(component.queryByTestId("c-intro__skip"));
		expect(component.fixture.componentInstance.startApp).toHaveBeenCalled();
		expect(navCtrlSpy.navigateForward).toHaveBeenCalled();
		expect(authProviderSpy.saveIntro).toHaveBeenCalled();
	});
});
