const webpack = require('webpack')

module.exports = {
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