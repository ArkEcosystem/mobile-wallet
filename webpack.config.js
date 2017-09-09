const webpackConfig = require('./node_modules/@ionic/app-scripts/config/webpack.config');
const path = require('path');

webpackConfig.resolve = {
  extensions: ['.ts', '.js'],
  alias: {
    '@providers': path.resolve('./src/providers/'),
    '@models': path.resolve('./src/models/'),
    '@app': path.resolve('./src/app/'),
  }
}
