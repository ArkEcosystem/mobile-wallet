import { expect } from "chai";
import {
	After,
	AfterAll,
	Before,
	Given,
	setDefaultTimeout,
	Then,
	When,
} from "cucumber";
import { by } from "protractor";
import { BrowserHelper } from "./utils/browser.po";

let browserHelper: BrowserHelper;

Before((_, callback) => {
	browserHelper = new BrowserHelper();
	callback();
});

Given("the user launches the application", () => {
	return browserHelper.navigateTo("/");
});

Given("the new user launches the application", async () => {
	await browserHelper.navigateTo("/");
	await browserHelper.clearStorage();
	await browserHelper.navigateTo("/");
});

Given("the user is in the {string} page", (url: string) => {
	return browserHelper.urlContains(url);
});

When("the user navigates to {string} page", (url: string) => {
	return browserHelper.navigateTo(url);
});
