// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
	const isCoverageEnabled = config.buildWebpack.options.codeCoverage;

	config.set({
		basePath: "",
		frameworks: ["jasmine", "@angular-devkit/build-angular"],
		plugins: [
			"karma-spec-reporter",
			"karma-sabarivka-reporter",
			"karma-coverage-istanbul-reporter",
			"karma-jasmine",
			"karma-chrome-launcher",
			"@angular-devkit/build-angular/plugins/karma",
		],
		reporters: ["spec", isCoverageEnabled ? "sabarivka" : null],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			jasmine: {
				random: false,
			},
		},
		coverageIstanbulReporter: {
			dir: require("path").join(__dirname, "coverage"),
			reports: ["html", "lcovonly", "text-summary"],
			fixWebpackSourcePaths: true,
		},
		coverageReporter: {
			include: [
				"src/**/*.ts",
				"!src/main.(ts|js)",
				"!src/**/*.spec.(ts|js)",
				"!src/**/*.module.(ts|js)",
				"!src/**/environment*.(ts|js)",
			],
		},
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",
				flags: [
					"--no-sandbox",
					"--disable-gpu",
					"--disable-web-security",
				],
			},
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ["ChromeHeadlessNoSandbox"],
		singleRun: false,
	});
};
