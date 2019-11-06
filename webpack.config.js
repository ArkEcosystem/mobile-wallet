const path = require('path');
const defaults = require('@ionic/app-scripts/config/webpack.config');

module.exports = function() {
  const aliases = {
    '@components': path.resolve('./src/components/'),
    '@providers': path.resolve('./src/providers/'),
    '@models': path.resolve('./src/models/'),
    '@directives': path.resolve('./src/directives/'),
    "@utils": path.resolve("./src/utils/"),
    '@pipes': path.resolve('./src/pipes/'),
    '@app': path.resolve('./src/app/'),
    '@root': path.resolve('./'),
  };

  defaults.dev.resolve.alias = aliases;
  defaults.prod.resolve.alias = aliases;

  const cryptoLoader = {
    test: /\.js$/,
    loader: [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            'env'
          ],
          plugins: [
            ['transform-runtime', { regenerator: true }],
            ['transform-object-rest-spread', { useBuiltIns: true }]
          ]
        }
      },
    ],
    include: [
      path.resolve(__dirname, 'node_modules/@arkecosystem')
    ]
  }

  defaults.dev.module.loaders.push(cryptoLoader)
  defaults.prod.module.loaders.push(cryptoLoader)

  return defaults;
}
