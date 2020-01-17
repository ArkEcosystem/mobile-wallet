import { AppPage } from "./app.po";

describe("new App", () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it("should have a title", () => {
		page.navigateTo();
		expect(page.getTitle()).toEqual("Mobile ARK");
	});
});
