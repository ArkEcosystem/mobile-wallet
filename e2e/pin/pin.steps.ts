import { expect } from "chai";
import { Before, Given, Then, When } from "cucumber";
import { PinScreen } from "./pin.po";

let pinScreen: PinScreen;

Before((_, callback) => {
	pinScreen = new PinScreen();
	callback();
});

When("the user fills the pin code with {string}", (pin: string) => {
	const sequence = pin.split("").map(parseFloat);
	return pinScreen.fillPinCodeKeyboard(sequence);
});

Then("the pin code modal is visible", async () => {
	return expect(await pinScreen.isPinCodeModalVisible()).to.be.true;
});
