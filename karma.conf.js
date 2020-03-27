// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

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
		reporters: ["spec", isCoverageEnabled ? "sabarivka" : null].filter(
			Boolean,
		),
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
				"!src/main.ts",
				"!src/test.ts",
				"!src/polyfills.ts",
				"!src/app/app.constants.ts",
				"!src/**/*.stories.ts",
				"!src/**/*.spec.ts",
				"!src/**/*.module.ts",
				"!src/**/environment*.ts",
			],
		},
		customLaunchers: {
			ChromeHeadlessCI: {
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
		browsers: ["ChromeHeadlessCI"],
		singleRun: false,
	});
};
