import { expect } from "chai";
import { Before, Then, When } from "cucumber";
import { LoginScreen } from "./login.po";

let loginScreen: LoginScreen;

Before((_, callback) => {
	loginScreen = new LoginScreen();
	callback();
});

Then("the login screen is displayed correctly", async () => {
	return expect(await loginScreen.isLoginControlsVisible()).to.be.true;
});

When("the create profile button is pressed in the login screen", async () => {
	return loginScreen.clickCreateProfileButton();
});
