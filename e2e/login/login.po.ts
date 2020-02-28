import { BrowserHelper } from "../utils/browser.po";

export class LoginScreen {
	private browserHelper = new BrowserHelper();

	open() {
		return this.browserHelper.navigateTo("/login");
	}

	isLoginControlsVisible() {
		return this.browserHelper.isElementVisibleByXpath(
			"//*[@data-testid='c-login__controls']",
		);
	}

	getSignInButton() {
		return this.browserHelper.getElementByXpath(
			"//*[@data-testid='c-login__controls__sign-in']",
		);
	}

	getCreateProfileButton() {
		return this.browserHelper.getElementByXpath(
			"//*[@data-testid='c-login__controls__create-profile']",
		);
	}

	async clickSignInButton() {
		const btn = await this.getSignInButton();
		return btn.click();
	}

	async clickCreateProfileButton() {
		const btn = await this.getCreateProfileButton();
		return btn.click();
	}
}
