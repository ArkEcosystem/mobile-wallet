const webpack = require('webpack')

module.exports = {
  module: {
    rules: [
      {
        test   : /\.(scss|pcss)$/,
        loader : 'postcss-loader',
        options: {
          ident  : 'postcss',
          syntax: 'postcss-scss',
          plugins: () => [
            require('postcss-import'),
            require('tailwindcss'),
            require('postcss-nested'),
            require('autoprefixer'),
          ]
        }
      }
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/bcrypto\/lib\/node\/bn\.js/,
      '../js/bn.js'
    )
  ],
  node: {
    fs: 'empty'
  }
}