// Karma configuration file, see link for more information
// https://karma-runner.github.io/2.0/config/configuration-file.html

module.exports = function (config) {
  const coverage = config.angularCli && config.angularCli.codeCoverage

  const plugins = [
    require('@angular/cli/plugins/karma'),
    require('karma-chrome-launcher'),
    require('karma-spec-reporter'),
    // require('karma-jasmine-html-reporter'),
    require('karma-jasmine'),
  ]

  if (coverage) {
    plugins.push(require('karma-coverage-istanbul-reporter'))
  }

  config.set({
    basePath: '',
    frameworks: ['@angular/cli', 'jasmine'],
    plugins,
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
      environment: 'dev'
    },
    reporters: coverage ? ['progress', 'coverage-istanbul'] : ['progress', 'spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
