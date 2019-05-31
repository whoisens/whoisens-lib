const karmaConfig = require('./karma-shared.conf.js');

module.exports = function(config) {
  karmaConfig.logLevel = config.LOG_INFO;

  karmaConfig.files.push('./tests/esm.spec.js');

  karmaConfig.preprocessors = {
    './tests/esm.spec.js': ['webpack']
  };

  config.set(karmaConfig);
};
