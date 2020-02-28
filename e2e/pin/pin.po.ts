import { browser } from "protractor";
import { BrowserHelper } from "../utils/browser.po";

export class PinScreen {
	private browserPage = new BrowserHelper();

	isPinCodeModalVisible() {
		return this.browserPage.isElementVisibleByXpath(
			"//*[@data-testid='c-modal-pin']",
		);
	}

	getPinCodeKeyboardButtons() {
		return this.browserPage.getAllElementsByXpath(
			'//*[contains(@data-testid, "c-modal-pin__keyboard__button")]',
		);
	}

	async fillPinCodeKeyboard(pin: number[]) {
		const keyboard = await this.getPinCodeKeyboardButtons();
		for (const char of pin) {
			const element = keyboard[char - 1];
			element.click();
			await browser.sleep(100);
		}
	}
}
