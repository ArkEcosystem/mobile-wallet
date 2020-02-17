import { ComponentFixture } from "@angular/core/testing";

import { TestHelpers } from "@@/test/helpers";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
	let pageComponent: AppComponent;
	let pageFixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {
		const { fixture, component } = await TestHelpers.beforeEachCompiler([
			AppComponent,
		]);
		pageFixture = fixture;
		pageComponent = component;
		pageFixture.detectChanges();
	});

	it("should create", () => {
		expect(pageComponent).toBeTruthy();
	});
});
