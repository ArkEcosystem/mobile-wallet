// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const puppeteer = require("puppeteer");

exports.config = {
	allScriptsTimeout: 11000,
	capabilities: {
		browserName: "chrome",
		chromeOptions: {
			args: ["--headless"],
			binary: puppeteer.executablePath(),
		},
	},
	directConnect: true,
	baseUrl: "http://localhost:4200/",
	specs: ["./**/*.feature"],
	framework: "custom",
	frameworkPath: require.resolve("protractor-cucumber-framework"),
	cucumberOpts: {
		strict: true,
		format: ["progress-bar"],
		require: ["./**/*.steps.ts"],
	},
	onPrepare() {
		require("ts-node").register({
			project: require("path").join(__dirname, "./tsconfig.e2e.json"),
		});
	},
};
