import { browser, by, element, ElementFinder } from "protractor";
import { BrowserHelper } from "../utils/browser.po";

export class IntroScreen {
	private browserHelper = new BrowserHelper();

	async getSwiperContainer() {
		return this.browserHelper.isElementVisibleByXpath(
			"//*[contains(@class, 'swiper-container-initialized')]",
			5000,
		);
	}

	async getActiveSlideId(): Promise<string> {
		return this.browserHelper.getAttributeByXpath(
			"//*[contains(@class, 'swiper-slide-active')]",
			"data-testid",
		);
	}

	async getActivePaginationId() {
		await browser.sleep(300);
		return this.browserHelper.getAttributeByXpath(
			"//*[contains(@class, 'c-intro__pagination')]//*[contains(@class, 'active')]",
			"data-testid",
		);
	}

	clickNextButton() {
		return this.browserHelper.clickByXpath(
			"//*[@data-testid='c-intro__next']",
		);
	}

	isDoneButtonVisible() {
		return this.browserHelper.isElementVisibleByXpath(
			"//*[@data-testid='c-intro__done']",
		);
	}

	clickSkipButton() {
		return this.browserHelper.clickByXpath(
			"//*[@data-testid='c-intro__skip']",
		);
	}
}
