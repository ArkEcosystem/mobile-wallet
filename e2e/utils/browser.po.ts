import {
	browser,
	by,
	element,
	ElementFinder,
	ExpectedConditions,
	Locator,
} from "protractor";

export class BrowserHelper {
	async navigateTo(url: string) {
		await browser.get(url);
		return browser.waitForAngular();
	}

	getTitle() {
		return browser.getTitle();
	}

	async urlContains(url: string) {
		await browser.waitForAngular();
		return browser.wait(ExpectedConditions.urlContains(url), 5000);
	}

	async clickByXpath(xpath: string) {
		return element(by.xpath(xpath)).click();
	}

	async waitForElement(
		locator: Locator,
		timeout = 3000,
	): Promise<ElementFinder> {
		const el = element(locator);
		await browser.wait(ExpectedConditions.presenceOf(el), timeout);
		return el;
	}

	async getElementByXpath(xpath: string, timeout?: number) {
		return this.waitForElement(by.xpath(xpath), timeout);
	}

	async isElementVisibleByXpath(xpath: string, timeout?: number) {
		const el = await this.getElementByXpath(xpath, timeout);
		return el.isDisplayed();
	}

	async getAttributeByXpath(xpath: string, attr: string, timeout?: number) {
		const el = await this.getElementByXpath(xpath, timeout);
		return el.getAttribute(attr);
	}

	getAllElementsByXpath(xpath: string) {
		return browser.element.all(by.xpath(xpath));
	}

	async clearStorage() {
		await browser.executeScript("window.localStorage.clear()");
		await browser.executeScript(
			"window.indexedDB.deleteDatabase('_ionicstorage')",
		);
	}
}
