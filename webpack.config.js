const webpackConfig = require('./node_modules/@ionic/app-scripts/config/webpack.config');
const path = require('path');

webpackConfig.dev.resolve = {
  extensions: ['.ts', '.js', '.json'],
  alias: {
    '@components': path.resolve('./src/components/'),
    '@providers': path.resolve('./src/providers/'),
    '@models': path.resolve('./src/models/'),
    '@pipes': path.resolve('./src/pipes/'),
    '@app': path.resolve('./src/app/'),
    '@root': path.resolve('./'),
  }
}
