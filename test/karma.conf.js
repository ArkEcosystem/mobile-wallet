// Karma configuration file, see link for more information
// https://karma-runner.github.io/2.0/config/configuration-file.html

module.exports = function (config) {
  const coverage = config.angularCli && config.angularCli.codeCoverage

  const custom = {
    plugins: [
      require('karma-webpack'),
      require('@angular/cli/plugins/karma'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      // require('karma-jasmine-html-reporter'),
      require('karma-jasmine'),
    ],
    basePath: '',
    frameworks: ['@angular/cli', 'jasmine'],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    specReporter: {
      suppressPassed: true,
      suppressSkipped: true,
    },
    angularCli: {
      progress: false,
      sourcemap: false,
      environment: 'dev'
    },
    // Adds empty polyfills of Node modules
    webpack: {
      node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      }
    },
    reporters: coverage ? ['progress', 'coverage-istanbul'] : ['progress', 'spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserNoActivityTimeout: 60000,
    autoWatch: true,
    // Using ` --browsers Chrome` displays the browser
    browsers: ['ChromeHeadless'],
    singleRun: false
  }

  if (coverage) {
    custom.plugins.push(require('karma-coverage-istanbul-reporter'))
  }

  if (process.env.TRAVIS) {
    custom.browsers.push('ChromeHeadlessNoSandbox')
    custom.customLaunchers = {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  }

  config.set(custom);
};
