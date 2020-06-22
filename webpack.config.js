const webpack = require("webpack");

const bigIntPolyfill = [];

bigIntPolyfill.push(
	new webpack.ProvidePlugin({
		BigInt: "big-integer",
	}),
);

module.exports = {
	module: {
		rules: [
			{
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
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts/",
						},
					},
				],
			},
		],
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(
			/node_modules\/bcrypto\/lib\/node\/bn\.js/,
			"../js/bn.js",
		),
		...bigIntPolyfill,
	],
	node: {
		fs: "empty",
	},
};
