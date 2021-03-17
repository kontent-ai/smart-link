const path = require('path');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
    ],
    files: [
      { pattern: 'src/**/*.ts' },
      { pattern: 'test-browser/**/*.ts' },
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'test-browser/**/*.ts': ['karma-typescript'],
    },
    reporters: ['kjhtml', 'progress', 'karma-typescript', 'coverage-istanbul'],
    browsers: ['Chrome'],
    karmaTypescriptConfig: {
      compilerOptions: {
        downlevelIteration: true,
        module: 'commonjs',
        lib: [
          'es2017',
          'dom',
          'dom.iterable',
        ],
        sourceMap: true,
        target: 'es2015',
      },
      exclude: [
        'node_modules',
      ],
      bundlerOptions: {
        transforms: [
          require('karma-typescript-es6-transform')(),
        ],
      },
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
    },
    port: 9669,
    colors: true,
    autoWatch: true,
    singleRun: false,
    client: {
      clearContext: false,
    },
    logLevel: config.DEBUG,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 5000000,
  });
};
