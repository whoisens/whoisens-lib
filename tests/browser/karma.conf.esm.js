const karmaConfig = require('./karma-shared.conf.js');

module.exports = function(config) {
  karmaConfig.logLevel = config.LOG_INFO;

  karmaConfig.files.push('./modules/esm.js');

  karmaConfig.preprocessors = {
    './modules/esm.js': ['webpack']
  };

  config.set(karmaConfig);
};
