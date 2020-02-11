import { ComponentFixture } from "@angular/core/testing";

import { TestHelpers } from "@@/test/helpers";
import { IntroPage } from "./intro";

describe("IntroPage", () => {
	let pageComponent: IntroPage;
	let pageFixture: ComponentFixture<IntroPage>;

	beforeEach(async () => {
		const { fixture, component } = await TestHelpers.beforeEachCompiler([
			IntroPage,
		]);
		pageFixture = fixture;
		pageComponent = component;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(pageComponent).toBeTruthy();
	});

	it("should contain next button", () => {
		const element: HTMLElement = pageFixture.debugElement.nativeElement;
		const nextBtn = element.querySelector("#next");

		expect(nextBtn).toBeTruthy();
	});

	it("should contain skip button", () => {
		const element: HTMLElement = pageFixture.debugElement.nativeElement;
		const skipBtn = element.querySelector("#skip");

		expect(skipBtn).toBeTruthy();
	});
});
