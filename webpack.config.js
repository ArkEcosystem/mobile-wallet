const webpackConfig = require('./node_modules/@ionic/app-scripts/config/webpack.config');
const path = require('path');

webpackConfig.resolve = {
  extensions: ['.ts', '.js'],
  alias: {
    '@components': path.resolve('./src/components/'),
    '@providers': path.resolve('./src/providers/'),
    '@models': path.resolve('./src/models/'),
    '@pipes': path.resolve('./src/pipes/'),
    '@app': path.resolve('./src/app/'),
  }
}
