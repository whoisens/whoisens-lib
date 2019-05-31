const karmaConfig = require('./karma-shared.conf.js');

module.exports = function(config) {
  karmaConfig.logLevel = config.LOG_INFO;

  karmaConfig.files.push(
    '../../dist/browser/main.js',
    './tests/bundle.spec.js'
  );

  karmaConfig.preprocessors = {
    './tests/bundle.spec.js': ['webpack']
  };

  config.set(karmaConfig);
};
