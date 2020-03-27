module.exports = {
	stories: ["../src/**/*.stories.[tj]s"],
	webpackFinal: config => {
		config.module.rules.push({
			test: /\.(scss|pcss)$/,
			loader: "postcss-loader",
			options: {
				ident: "postcss",
				syntax: "postcss-scss",
				plugins: () => [
					require("postcss-import"),
					require("tailwindcss"),
					require("postcss-nested"),
					require("autoprefixer"),
				],
			},
		});

		return config;
	},
};
