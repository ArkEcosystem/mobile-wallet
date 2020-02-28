import { expect } from "chai";
import { Before, Then, When } from "cucumber";
import { IntroScreen } from "./intro.po";

let introScreen: IntroScreen;

Before((_, callback) => {
	introScreen = new IntroScreen();
	callback();
});

Then("the intro screen is displayed correctly", () => {
	return introScreen.getSwiperContainer();
});

When(
	"the {string} button is pressed in the intro screen",
	async (name: "next" | "skip") => {
		switch (name) {
			case "next":
				return introScreen.clickNextButton();
			case "skip":
				return introScreen.clickSkipButton();
			default:
				throw new Error();
		}
	},
);

Then("the second slide is visible in the intro screen", async () => {
	const activeSlideId = await introScreen.getActiveSlideId();
	const activePaginationId = await introScreen.getActivePaginationId();
	expect(activeSlideId).to.be.equal("c-intro__slides__slide-1");
	expect(activePaginationId).to.be.equal("c-intro__pagination__page-1");
});

When("the user completes the sliding in the intro screen", async () => {
	await introScreen.clickNextButton();
	await introScreen.clickNextButton();
	await introScreen.clickNextButton();
});

Then("the done button is visible in the intro screen", async () => {
	return expect(await introScreen.isDoneButtonVisible()).to.be.true;
});
