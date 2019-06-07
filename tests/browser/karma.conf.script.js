const karmaConfig = require('./karma-shared.conf.js');

module.exports = function(config) {
  karmaConfig.logLevel = config.LOG_INFO;

  karmaConfig.files.push(
    '../../dist/browser/main.js',
    './modules/script.js'
  );

  karmaConfig.preprocessors = {
    './modules/script.js': ['webpack']
  };

  config.set(karmaConfig);
};
