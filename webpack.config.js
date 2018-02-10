const path = require('path');
const defaults = require('@ionic/app-scripts/config/webpack.config');

module.exports = function() {
  const aliases = {
    '@components': path.resolve('./src/components/'),
    '@providers': path.resolve('./src/providers/'),
    '@models': path.resolve('./src/models/'),
    '@directives': path.resolve('./src/directives/'),
    '@pipes': path.resolve('./src/pipes/'),
    '@app': path.resolve('./src/app/'),
    '@root': path.resolve('./'),
  };

  defaults.dev.resolve.alias = aliases;
  defaults.prod.resolve.alias = aliases;

  return defaults;
}
